const storage = require('node-persist');
const Promise = require('bluebird');
storage.initSync({
    dir: require('path').join(__dirname, '..', '.proxystats'),
    interval: 10000,
    continuous: false
});

const REJECTED = 'reject';
const ALLOWED = 'allowed';

const increment = which => {
    return storage.setItem(which, (storage.getItemSync(which) || 0) + 1).catch(console.error);
};
const incrementRejected = () => {
    return increment(REJECTED);
};
const incrementAllowed = () => {
    return increment(ALLOWED);
};

const normalise = v => v || 0;

const get = which => storage.getItem(which).then(normalise).catch(console.error);
const getRejected = () => get(REJECTED);
const getAllowed = () => get(ALLOWED);

const getBothCB = (rejected, allowed) => {
    return {
        rejected,
        allowed,
        total: rejected + allowed
    };
};
const getBoth = () => {
    return Promise.all([getRejected(), getAllowed()]).spread(getBothCB);
};

module.exports = {
    incrementAllowed,
    incrementRejected,
    getRejected,
    getAllowed,
    getBoth
};