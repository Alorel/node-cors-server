A CORS proxy server ready to be deployed to Redhat Cloud, Heroku or whatever it is you use.

Built with Node 7, might work with older versions.

[![NPM stats](https://nodei.co/npm/express-cors-proxy-server.png?downloads=false&downloadRank=false&stars=false)](https://www.npmjs.com/package/express-cors-proxy-server)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demo](#demo)
- [Safeguards](#safeguards)
- [Status endpoints](#status-endpoints)
  - [/stats](#stats)
  - [/info/gen](#infogen)
  - [/info/poll](#infopoll)
  - [/health](#health)
- [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Demo

https://corsproxy-alorel.rhcloud.com/

# Safeguards

- Non-GET requests are blocked; HTTP 405 is returned.
- Content-Length filtering
- Content-Type filtering

# Status endpoints
## /stats

Returns a random cluster's stats, for example:

```json
{
    "cluster_id": "7cec873c-d2bb-495a-bb06-48568f2423c4",
    "rejected": 0,
    "approved": 0,
    "uptime": 16472,
    "uptime_str": "16sec",
    "total": 0,
    "rejectPCT": 0,
    "approvePCT": 0
}
```

Can be disabled.

## /info/gen

Returns some OS info. Can be disabled.

```json
[
    {"name":"Node.js Version","value":"7.4.0"},
    {"name":"NPM Version","value":"4.1.2\n"},
    {"name":"OS Type","value":"Windows_NT"},
    {"name":"OS Platform","value":"win32"},
    {"name":"OS Architecture","value":"x64"},
    {"name":"OS Release","value":"6.1.7601"},
    {"name":"CPU Cores","value":8}
]
```

## /info/poll

Returns more server info. Can be disabled.

```json
[
    {"name":"Free Memory","value":"783MB"},
    {"name":"Uptime","value":"64834.9022395s"}
]
```

## /health

Responds with HTTP 200. Can't be disabled. Required for Redhat Cloud.

# Configuration

Edit **config.json**.

  - cache_max_age
    - Every request to the proxy results in a HEAD request being made to the target URL to filter out the content type and
    content length. This is how long these requests are cached for.
  - cache_size
    - Maximum number of HEAD requests in cache.
  - endpoints
    - stats
      - enable/disable the */stats* endpoint
    - gen
      - enable/disable the */info/gen* endpoint
    - poll
      - enable/disable the */info/poll* endpoint
  - headers
    - cors
      - List of headers to append to CORS requests
    - global
      - List of headers to append to **every** request
  - ctypes
    - deny
      - CORS requests will be rejected if the target resource content-type contains any of these substrings
    - allow
      - If *deny* didn't block the request yet, check this array. Only content types containing one of these substrings
      will be allowed.