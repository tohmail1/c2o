var express = require('express');
var http = require('http');
//var https = require('spdy');
//var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');
var path = require('path');

/*
var LEX = require('letsencrypt-express').testing();

var DOMAIN = 'iotlab.ddns.net';
var EMAIL = 'toh.mail1@gmail.com';

var lex = LEX.create({
  configDir: require('os').homedir() + '/letsencrypt/etc'
, approveRegistration: function (hostname, approve) { // leave `null` to disable automatic registration
    if (hostname === DOMAIN) { // Or check a database or list of allowed domains
      approve(null, {
        domains: [DOMAIN]
      , email: EMAIL
      , agreeTos: true
      });
    }
  }
});
*/

/*

var options = {
   key  : fs.readFileSync('./keys/key.pem'),
   cert : fs.readFileSync('./keys/csr.pem')
};
*/

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var config = {
  dbServer: {
    protocol: 'http://',
    host: 'iotlab.ddns.net:5984',
    user: 'admin',
    password: 'tohtik01',
    userDB: 'c2o-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
        }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true,
  },
  userDBs: {
    defaultDBs: {
      private: ['c2o'],
      shared: ['c2r','c2h','r2h']
    },
    model: {
     // If your database is not listed below, these default settings will be applied
      //_default: {
        // Array containing name of the design doc files (omitting .js extension), in the directory configured below
        //designDocs: ['mydesign'],
        // these permissions only work with the Cloudant API
        //permissions: ['_reader', '_replicator'],
    //  },
      c2h: {
        designDocs: ['c2h'],
        //permissions: ['_reader', '_replicator'],
        // 'private' or 'shared'
        type: 'shared',
        // Roles that will be automatically added to the db's _security object of this specific db
        adminRoles: [],
        memberRoles: []
      }
    },
    designDocDir: path.join(__dirname, './designDocs')
  },
  providers: {
    local: true
  }
}

/*
var spdy_options = {
  // Private key
  key: fs.readFileSync(__dirname + '/keys/key.pem'),

  // Fullchain file or cert file (prefer the former)
  cert: fs.readFileSync(__dirname + '/keys/csr.pem'),

  // **optional** SPDY-specific options
  spdy: {
    protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
    plain: false,

    // **optional**
    // Parse first incoming X_FORWARDED_FOR frame and put it to the
    // headers of every request.
    // NOTE: Use with care! This should not be used without some proxy that
    // will *always* send X_FORWARDED_FOR
    'x-forwarded-for': true,

    connection: {
      windowSize: 1024 * 1024, // Server's window size

      // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
      autoSpdy31: false
    }
  }
};

*/

// Initialize SuperLogin
var superlogin = new SuperLogin(config);

/*
superlogin.removeUser("cooker1", true);
superlogin.removeUser("cooker2", true);
superlogin.removeUser("hunger1", true);
superlogin.removeUser("hunger2", true);
superlogin.removeUser("rider1", true);
*/
//superlogin.removeUser("hunger1", true);


/*
var cooker1 = {
  name: 'cooker1',
  username: 'cooker1',
  email: 'cooker1@example.com',
  password: 'cooker1',
  confirmPassword: 'cooker1'
};

var headers = new Headers();
headers.append('Content-Type', 'application/json');

superlogin.createUser()
*/

// Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router);

app.listen(app.get('port'));
console.log("App listening on " + app.get('port'));

/*
https.createServer(options, app).listen(3000, function () {
   console.log('Started!');
});
*/

/*
var server = spdy.createServer(spdy_options, function(req, res) {
  res.writeHead(200);
  res.end('hello world!');
});
server.listen(3000);
*/

/*
function redirectHttp() {
  http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
    res.setHeader('Location', 'https://' + req.headers.host + req.url);
    res.statusCode = 302; // use 307 if you want to redirect requests with POST, DELETE or PUT action.
    res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
  })).listen(80);
}

function serveHttps() {
  //var app = require('express')();



  https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app)).listen(3000);
}

console.log("require('os').homedir(): ", require('os').homedir());

//redirectHttp();
//serveHttps();
*/
