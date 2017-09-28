var http = require('http');
var qs = require('querystring');
// var OAuth = require('oauth'), OAuth2 = OAuth.OAuth2;
var OAuth2 = require('./lib/oauth2.js').OAuth2;

// begin to set session option
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var config = require('./config.js');
var sessionoption = { secret: config.cookie_secret };

if (config.session_name && config.session_name.length > 0) {
    sessionoption.name = config.session_name;
} else {
    console.log("SESSION_NAME NOT specified, use default value.")
}
if (config.cookie_scope_domain && config.cookie_scope_domain.length > 0) {
    //console.log("config.cookie_scope_domain",config.cookie_scope_domain)
    sessionoption.cookie = { domain: '.' + config.cookie_scope_domain };
} else {
    console.log("COOKIE_SCOPE_DOMAIN NOT specified or zero value.")
}
console.log(sessionoption);

var app = express();
app.use(cookieParser());
app.use(session(sessionoption))
//end of setting session option


var clientID = '20170830061623854-E5A8-B2FABDC35';
var clientSecret = '9c25b1c7cb9641bba4cb8ce4960e24ea';
var oauth2 = new OAuth2(clientID,
                            clientSecret,
                            'http://uuapitest.c.citic/',
                            'oauthorize/authorize',
                            'oauthorize/getToken',
                            null); /** Custom headers */
var token = "";

app.use(function (req, res) {
    var p = req.url.split('/');
    pLen = p.length;
    var token = "";
    /**
     * Authorised url as per github docs:
     * https://developer.github.com/v3/oauth/#redirect-users-to-request-github-access
     *
     * getAuthorizedUrl: https://github.com/ciaranj/node-oauth/blob/master/lib/oauth2.js#L148
     * Adding params to authorize url with fields as mentioned in github docs
     *
     */
    var authURL = oauth2.getAuthorizeUrl({
        redirect_uri: 'http://localhost:8999/code',
        // scope: ['repo', 'user'],
        response_type:"code",
        state: '1231'
    });


    /**
     * Creating an anchor with authURL as href and sending as response
     */
    var body = '<a href="' + authURL + '"> Get Code </a>';

    if (pLen === 2 && p[1] === '') {
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/html' });
        res.end(body);
    } else if (pLen === 2 && p[1].indexOf('code') === 0) {

        /** Github sends auth code so that access_token can be obtained */
        var qsObj = {};

        /** To obtain and parse code='...' from code?code='...' */
        qsObj = qs.parse(p[1].split('?')[1]);

        /** Obtaining access_token */
        oauth2.getOAuthAccessToken(
            qsObj.code,
            {'redirect_uri': 'http://localhost:8999/code/'},
            function (e, access_token, refresh_token, results){
                if (e) {
                    console.log(e);
                    res.end(e);
                } else if (results.error) {
                    console.log(results);
                    res.end(JSON.stringify(results));
                }
                else {
                    console.log('Obtained access_token: ', access_token);

                    oauth2.getProtectedResource("http://uuapitest.c.citic/user/getUserInfo", access_token,function (results,result,res) {
                        console.log("user info :");
                        // console.log(res);
                        if(result){
                            console.log(result);
                            console.log(res.statusCode);
                            user_data = JSON.parse(result);
                            req.session.cas_user_name = user_data["displayName"];
                            req.session.cas_user_email = user_data["mail"];
                            req.session.cas_user_userId = user_data["uid"];
                            req.session.cas_user_mobile = user_data["mobile"];
                            req.session.cas_user_loginName = user_data["loginName"];
                            req.session.token = access_token;
                            console.log(req.session)
                            console.log("user", req.session.cas_user_loginName, "login");
                            //
                            req['headers'].http_x_forwarded_for = req.connection.remoteAddress;
                            req['headers'].http_x_proxy_cas_username = req.session.cas_user_name;
                            req['headers'].http_x_proxy_cas_email = req.session.cas_user_email;
                            req['headers'].http_x_proxy_cas_userid = req.session.cas_user_userId;
                            req['headers'].http_x_proxy_cas_mobile = req.session.cas_user_mobile;
                            req['headers'].http_x_proxy_cas_loginname = req.session.cas_user_loginName;
                            console.log(req.headers);

                        }
                    })
                }

            });


    } else {
        // Unhandled url
    }

})

http.createServer(app).listen(8999);
