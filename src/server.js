/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import schema from './data/schema';
import Router from './routes';
import assets from './assets';
import Ibc1 from 'ibm-blockchain-js';
import { port, auth, analytics } from './config';

const server = global.server = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//
// ibm-blockchain-js initialization
// -----------------------------------------------------------------------------
var ibc = new Ibc1();
var chaincode = {};

// ==================================
// configure ibc-js sdk
// currently configured to...
//  - Emmanuel's blockchain service, and
//  - marbles demo chaincode
// ==================================
var options =   {
  network:{
    'peers': [
      {
        'api_host': 'aaa58403-33ee-41b1-9ec0-45f3ec4c7f96_vp1-api.blockchain.ibm.com',
        'api_port_tls': 443,
        'api_port': 80,
        'id': 'aaa58403-33ee-41b1-9ec0-45f3ec4c7f96'
      },
      {
        'api_host': 'aaa58403-33ee-41b1-9ec0-45f3ec4c7f96_vp2-api.blockchain.ibm.com',
        'api_port_tls': 443,
        'api_port': 80,
        'id': 'aaa58403-33ee-41b1-9ec0-45f3ec4c7f96'
      }
    ],
    users: [
      {
    		'enrollId': 'dashboarduser_type0_f51ef4cefc',
    		'enrollSecret': 'f9953b6b5e'
    	},
      {
        "enrollId": "user_type1_cbd1460197",
        "enrollSecret": "00aeacd492"
      }
    ]
  },
  options: {
    quiet: true,
    tls:false,
    maxRetry: 1
  },
  chaincode:{
    // marbles chaincode repository
    zip_url: 'https://github.com/ibm-blockchain/marbles-chaincode/archive/master.zip',
    unzip_dir: 'marbles-chaincode-master/hyperledger/part1',								//subdirectroy name of chaincode after unzipped
    git_url: 'https://github.com/ibm-blockchain/marbles-chaincode/hyperledger/part1',		//GO get http url

    // emmanuel's test chaincode repository
    // zip_url: 'https://github.com/eman3220/emanschaincodetest/archive/master.zip',
    // unzip_dir: 'emanschaincodetest-master/hyperledger/part1',								//subdirectroy name of chaincode after unzipped
    // git_url: 'https://github.com/eman3220/emanschaincodetest/hyperledger/part1',		//GO get http url
  }
};

ibc.load(options, cb_ready);

function cb_ready(err, cc){
    chaincode = cc;
    console.log("The chaincode is: "+JSON.stringify(chaincode));
    if(cc.details.deployed_name === ""){                //decide if I need to deploy or not
        cc.deploy('init', ['99'], null, cb_deployed);
    }
    else {
        console.log("NAME IS: "+cc.details.deployed_name);
        console.log('chaincode summary file indicates chaincode has been previously deployed');
        cb_deployed();
    }
}

function cb_deployed(err){
  console.log('sdk has deployed code and waited');
  chaincode.query.read(['a']);
}


//
// API endpoints
// -----------------------------------------------------------------------------
server.get('/api', function (req, res) {
    res.send(getWelcome());
});

server.post('/api/election/vote/v1', function(req, res) {
  // get information for block

  var election_id,
      vote_id,
      voter_token;

  // chaincode.invoke.OUR_FUNCTION([arg1, arg2, ...], function() {
    // console.log('OUR_FUNCTION response:', data, err);
  // });

  res.sendStatus(200);
});

// hardcoded response for getting election data
server.get('/api/election/data/v1', function(req, res) {
  res.json(getElectionData());
});

//
// Authentication
// -----------------------------------------------------------------------------
server.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
  getToken: req => req.cookies.id_token,
  /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
}));
server.use(passport.initialize());

server.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
server.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => (data.title = value),
      onSetMeta: (key, value) => (data[key] = value),
      onPageNotFound: () => (statusCode = 404),
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    res.status(statusCode);
    res.send(template(data));
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});

// ----------- stuff -----------------


function getWelcome() {
  return "HELLO ... /api/election/vote/v1 ... /api/election/data/v1";
}

function getElectionData(){
    return {
        election: {
          election_id:"0001",
          election_name:"MyElection",
          parties:[
            {
              party_id:"01",
              party_name:"Blue",
              candidates:[
                {
                  candidate_id:"01",
                  candidate_name:"Arya Stark"
                },
                {
                  candidate_id:"02",
                  candidate_name:"John Snow"
                }
              ]
            },
            {
              party_id:"02",
              party_name:"Red",
              candidates:[
                {
                  candidate_id:"01",
                  candidate_name:"Jamie Lanister"
                },
                {
                  candidate_id:"02",
                  candidate_name:"Cersie Lanister"
                }
              ]
            },
          ]
        }
      };
}
