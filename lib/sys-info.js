const os = require('os'),
    env = process.env;

let gen = [{
    name: 'Node.js Version',
    value: process.version.replace('v', '')
}, {
    name: 'NPM Version',
    value: require('child_process').execSync('npm --version').toString().replace(os.EOL, '')
}, {
    name: 'OS Type',
    value: os.type()
}, {
    name: 'OS Platform',
    value: os.platform()
}, {
    name: 'OS Architecture',
    value: os.arch()
}, {
    name: 'OS Release',
    value: os.release()
}, {
    name: 'CPU Cores',
    value: os.cpus().length
}];

if (env.OPENSHIFT_GEAR_MEMORY_MB) {
    gen.push({
        name: 'Gear Memory',
        value: `${env.OPENSHIFT_GEAR_MEMORY_MB}MB`
    });
}

if (env.NODE_ENV) {
    gen.push({
        name: 'NODE_ENV',
        value: env.NODE_ENV
    });
}

exports.gen = gen;
exports.poll = () => {
    return [{
        name: 'Free Memory',
        value: `${Math.round(os.freemem() / 1048576)}MB`
    }, {
        name: 'Uptime',
        value: `${os.uptime()}s`
    }];
};
