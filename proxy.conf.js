const PROXY_CONFIG = [
    {
        context: [
            "/config",
            "/api",
            "/vendor",
        ],
        target: "http://micro.local",
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    }
]


module.exports = PROXY_CONFIG;
