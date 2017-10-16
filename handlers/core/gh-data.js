const redis = require('../../lib/redis');
const request = require('../../request');
const config = require('../../config');
const merge = require('lodash/merge');
const find = require('lodash/find');
const Promise = require('bluebird');

const API_KEY = process.env[config.github.api_key_env];
const API_ROOT = 'https://api.github.com';

if (!API_KEY) {
  throw new Error('Github API key env variable missing');
} else if (!config.github.user) {
  throw new Error('Github user missing');
}

const buildParams = (params = {}) => {
  const defaults = {
    json: true,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${API_KEY}`,
      'User-Agent': 'Request'
    }
  };

  return merge(defaults, params);
};

const linkMapper = link => {
  const rel = link.match(/rel="([a-z]+)"/)[1];
  const url = link.match(/<([^>]+)>/)[1];
  const page = parseInt(url.match(/page=([0-9]+)$/)[1]);

  return {rel, url, page};
};

const linkRelPredicates = {
  next: link => link.rel === 'next',
  last: link => link.rel === 'last'
};

const parseLinks = links => {
  if (links) {
    links = links.split(',').map(linkMapper);

    if (links && links.length) {
      const nextLink = find(links, linkRelPredicates.next);
      const lastLink = find(links, linkRelPredicates.last);

      if (nextLink && lastLink) {
        const urls = [];

        for (let i = nextLink.page; i <= lastLink.page; i++) {
          urls.push(nextLink.url.replace(/page=[0-9]+$/, `page=${i}`));
        }

        return urls;
      }
    }
  }

  return null;
};

const reducers = {
  body(acc, repo) {
    acc.stars += repo.stargazers_count;
    acc.forks += Math.max(repo.forks || 0, repo.forks_count || 0);

    return acc;
  }
};

const getRepoPage = (userOrUrl, isUrl = false) => {
  let url;

  if (isUrl) {
    url = userOrUrl;
  } else {
    url = `${API_ROOT}/users/${userOrUrl}/repos?type=all&per_page=500`;
  }

  return request(url, buildParams())
    .then(r => {
      return {
        body: Object.assign(
          r.body.reduce(reducers.body, {stars: 0, forks: 0}),
          {count: r.body.length}
        ),
        links: parseLinks(r.response.headers.link)
      };
    })
};

const getRepos = user => {
  return getRepoPage(user)
    .then(r => {
      if (r.links && r.links.length) {
        return Promise.map(r.links, link => getRepoPage(link, true))
          .map(r => r.body)
          .then(bodies => bodies.concat(r.body))
      }

      return [r.body];
    })
    .reduce(
      (acc, summary) => {
        acc.stars += summary.stars;
        acc.forks += summary.forks;
        acc.count += summary.count;

        return acc;
      },
      {stars: 0, forks: 0, count: 0}
    );
};

const getUser = user => {
  return request(`${API_ROOT}/users/${user}`, buildParams())
    .then(r => {
      return {
        followers: r.body.followers
      };
    });
};

const REDIS_KEY = 'gh_cache';

module.exports = (req, res) => {
  redis.get(REDIS_KEY)
    .then(cachedData => {
      if (cachedData) {
        console.log('Got cached GitHub data');

        res.json(cachedData);
      } else {
        return Promise.all([
          getRepos(config.github.user),
          getUser(config.github.user)
        ])
        .then(responses => Object.assign(...responses))
        .then(r => {
          return redis.set(REDIS_KEY, r)
            .then(() => res.status(200).json(r));
        })
      }
    })
    .catch(e => {
      res.endWith(500, e);
    })
};
