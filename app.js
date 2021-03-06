/**
 * Hosts the web server behind oauthV2 Authentication or Google OAuth2 Authentication
 * with nodejs and express.
 * License: MIT
 */
var qs = require('querystring');
// var OAuth = require('oauth'), OAuth2 = OAuth.OAuth2;
var oauth_auth = require('./lib/oauth-auth');
var oauth_auth2 = require('./lib/oauth-auth2');
var express = require('express');
var https = require('https');
var http = require('http');
var url = require('url');
var httpProxy = require('http-proxy');
//var setCookie = require('set-cookie');
//var cookie = require('cookie-parser');
var config = require('./config');
// var cas_auth = require('./lib/cas-auth.js');
var fs = require("fs");


console.logCopy = console.log.bind(console);

console.log = function () {
    // Timestamp to prepend
    var timestamp = new Date().toJSON();
    var ts = "[" + Date() + "] ";
    if (arguments.length) {
        // True array copy so we can call .splice()
        var args = Array.prototype.slice.call(arguments, 0);
        // If there is a format string then... it must
        // be a string
        if (typeof arguments[0] === "string") {
            // Prepend timestamp to the (possibly format) string
            args[0] = ts + arguments[0];

            // Insert the timestamp where it has to be
            // args.splice(1, 0, ts);

            // Log the whole array
            this.logCopy.apply(this, args);
        }
        else {
            // "Normal" log
            this.logCopy(ts, args);
        }
    }
};

console.log('Server starting...');

run();
function run() {
    for (i in config.proxy_settings) {
        var subconfig = config.proxy_settings[i];
        run_one(config, subconfig);
    }
}
var loginname = false;
function run_one(config, subconfig) {
    var app = express();

    app.use(express.cookieParser());
    //config.cookie_scope_domain!===

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
    app.use(express.session(sessionoption));

    // Authentication
    // oauth_auth.configureOauth(app, config);
    oauth_auth2.configureOauth(app, config);
    //console.log('ws come here ��oauth_auth������');

    var proxy = httpProxy.createProxyServer({
        target: subconfig.proxy_url,
        ws: true
    });

    var proxied_hostname = url.parse(subconfig.proxy_url).hostname;

    app.use(function (req, res, next) {

        isReplaceHostname = (subconfig.replaceHostname === undefined) ? (config.replaceHostname || false) : subconfig.replaceHostname
        if (isReplaceHostname) {
            req['headers'].host = proxied_hostname;
        }

        if (!req.session.cas_user_name) {
            //console.log('session expires. require login');
            req.session.destroy();
            res.redirect('/auth/cas/login');
        } else {
            req['headers'].http_x_forwarded_for = req.connection.remoteAddress;
            req['headers'].http_x_proxy_cas_username = req.session.cas_user_name;
            req['headers'].http_x_proxy_cas_email = req.session.cas_user_email
            req['headers'].http_x_proxy_cas_userid = req.session.cas_user_userId
            req['headers'].http_x_proxy_cas_mobile = req.session.cas_user_mobile
            req['headers'].http_x_proxy_cas_loginname = req.session.cas_user_loginName

            console.log("session is");
            console.log(req.session);
            loginname = req.session.cas_user_loginName;

            proxy.web(req, res, { target: subconfig.proxy_url }, function (e) {
                console.log('error ' + e);
            });
        }

    });


    if (subconfig.enable_ssl_port === true) {
        var options = {
            key: fs.readFileSync(subconfig.ssl_key_file),
            cert: fs.readFileSync(subconfig.ssl_cert_file),
        };
        https.createServer(options, app).listen(subconfig.listen_port_ssl);
        console.log('Server listening on ' + subconfig.listen_port_ssl + '(SSL)');
    }
    var proxyServer = http.createServer(app).listen(subconfig.listen_port);

    proxyServer.on('upgrade', function (req, socket, head) {

        //req['headers'].http_x_proxy_cas_loginname ="user001";
        // console.log('ws come here ����upgrade reqheader',req.header);
        //console.log('ws come here ����upgrad',req.url);
        proxy.ws(req, socket, head);


    });

    proxy.on('error', function (err, req, res) {
        console.log('err', err);
    });

    console.log('Server listening on ' + subconfig.listen_port + ' -> ' + subconfig.proxy_url);
}
