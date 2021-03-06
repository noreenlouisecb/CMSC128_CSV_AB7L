'use strict';

const _    = require('lodash');
const path = require('path');

const config = {
    APP_NAME: 'REGINYZR',
    IP_ADDRESS: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    PORT: process.env.OPENSHIFT_NODEJS_PORT || 8000,

    COOKIE_SECRET: 'R3G1nYzR',

    LOGS_DIR: path.normalize(__dirname + '/../logs'),

    use: (env) => {
        _.assign(config, require(__dirname + '/env/' + env));
        return config;
    }
};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = config.use(process.env.NODE_ENV);
