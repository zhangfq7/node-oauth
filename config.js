// module.exports =  {
//
//     //for oauth authorization
//     "client_id":process.env.CLIENT_ID,
//     "client_secret":process.env.CLIENT_SECRET,
//     "response_type":process.env.RESPONSE_TYPE,
//     "state":process.env.STATE,
//
//     "enable_cas_auth": true,
//     "cas_server_url": process.env.CAS_SERVER,
//     "authorizeurl": process.env.OAUTH,
//     "accesstokenurl": process.env.TOKEN,
//     "validatetokenpath": process.env.VALID,
//     "userinfopath":process.env.USERINFO,
//
//     "cookie_scope_domain": process.env.COOKIE_SCOPE_DOMAIN,
//
//     "session_name": process.env.SESSION_NAME,
//
//     "cookie_secret": "'GC~[YW'K46NT'dhs>3'/1UKP=Vy>RBv?Rw5LOA[@9~93(E;23Q",
//
//     replaceHostname: true,
//
//     "rejectUnauthorized": false,
//
//     proxy_settings : [
//         {
//             proxy_url: process.env.PROXY_URL,
//             replaceHostname: false,
//             "listen_port": process.env.PROXY_PORT,
//             "enable_ssl_port": false
//         }
//     ]
// };
module.exports =  {
    //for oauth authorization
    "client_id":"20170830061623854-E5A8-B2FABDC35",
    "client_secret":"9c25b1c7cb9641bba4cb8ce4960e24ea",
    "response_type":"code",
    "state":"1231",

    "enable_cas_auth": true,
    "cas_server_url": "http://uuapitest.c.citic",
    "authorizeurl": "/oauthorize/authorize",
    "accesstokenurl": "/oauthorize/getToken",
    "validatetokenpath": "/oauthorize/checkTokenValid",
    "userinfopath":"/user/getUserInfo",
    "cookie_scope_domain": "dev-citic.dataos.io",

    "session_name": "test.connect.sid",

    "cookie_secret": "'GC~[YW'K46NT'dhs>3'/1UKP=Vy>RBv?Rw5LOA[@9~93(E;23Q",

    replaceHostname: true,

    "rejectUnauthorized": false,

    proxy_settings : [
        {
            proxy_url: "http://127.0.0.1:80",
            replaceHostname: false,
            listen_port: "8090",
            enable_ssl_port: false
        }
    ]
};

