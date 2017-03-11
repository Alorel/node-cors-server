const map = new WeakMap();
const msu = require('ms-util').toWords;

const _ = obj => {
    if (!map.has(obj))
        map.set(obj, {});
    return map.get(obj);
};

class Stats {

    constructor() {
        this.rejected = 0;
        this.approved = 0;
    }

    set rejected(val) {
        if (isNaN(val)) {
            throw new TypeError("Must be a number!");
        }
        _(this).rejected = val;
    }

    static get uptime() {
        return process.uptime() * 1000;
    }

    get rejected() {
        return _(this).rejected;
    }

    set approved(val) {
        if (isNaN(val)) {
            throw new TypeError("Must be a number!");
        }
        _(this).approved = val;
    }

    get approved() {
        return _(this).approved;
    }

    get stats() {
        const out = {
            rejected: this.rejected,
            approved: this.approved,
            uptime: Stats.uptime
        };
        out.uptime_str = msu(out.uptime);
        out.total = out.rejected + out.approved;

        if (out.total > 0) {
            out.rejectPCT = out.rejected / out.total * 100;
            out.approvePCT = out.approved / out.total * 100;
        } else {
            out.rejectPCT = 0;
            out.approvePCT = 0;
        }

        return out;
    }
}

module.exports = new Stats();