const PROXY_CONFIG = [
    {
        context: [
            "/config",
            "/proxy",
            "/dist",
            "/vendor",
            "/sldassets"
        ],
        target: "http://localhost/spicecrm_fe_factory",
        secure: false,
        "bypass": function (req, res, proxyOptions) {
            req.headers['authorization'] = 'Basic xxx';
        }
    }
]

module.exports = PROXY_CONFIG;