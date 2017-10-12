module.exports =  {
    //for oauth authorization
    "client_id":"20170830061623854-E5A8-B2FABDC35",
    "client_secret":"",
    "response_type":"code",
    "state":"1231",

    "enable_cas_auth": true,
    "cas_server_url": "http://uuapitest.c.citic/oauthorize/authorize",

    "cookie_scope_domain": "dev-citic.dataos.io",

    "session_name": "test.connect.sid",

    "cookie_secret": "'GC~[YW'K46NT'dhs>3'/1UKP=Vy>RBv?Rw5LOA[@9~93(E;23Q",

    replaceHostname: true,

    "rejectUnauthorized": false,

    proxy_settings : [
        {
            proxy_url: "http://127.0.0.1:8080",
            replaceHostname: false,
            listen_port: "8090",
            enable_ssl_port: false
        }
    ]
};

