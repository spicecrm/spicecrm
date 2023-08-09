const fs = require('fs');
const devTarget = fs.readFileSync('dev_server.url', 'utf8');

const PROXY_CONFIG = [
    {
        context: [
            "/config",
            "/api",
            "/vendor",
            "/node_modules",
            "/assets"
        ],
        target: devTarget.toString(),
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    }
]


module.exports = PROXY_CONFIG;
