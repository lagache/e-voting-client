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
import { port, auth, analytics } from './config';

const server = global.server = express();


var electionData;

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

server.get('/api', function (req, res) {
    res.send(getWelcome());
});

server.post('/api/election/vote/v1', function(req, res) {
  // get information for block

  console.log('option1=' + req.body.option1);
  // chaincode.invoke.init_marble(function() {
  //   return {"eman", "red", "20", "bob"}
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
    var electionDataMock = {
          id:"0001",
          name:"MyElection",
          options:[
            {
              id:"01",
              name:"Blue"
            },
            {
              id:"02",
              name:"Red"
            }
          ]
        };

    if(!electionData) {
      electionData = electionDataMock;
    }
// electionData:{  
//    "id":"0001",
//    "name":"my first election into blockchain",
//    "question":"what is your favorite color",
//    "options":[  
//       {  
//          "id":1,
//          "name":"red"
//       },
//       {  
//          "id":2,
//          "name":"blue"
//       },
//       {  
//          "id":3,
//          "name":"greeen"
//       },
//       {  
//          "id":4,
//          "name":"yellow"
//       }
//    ]
  
// }
    return {
        election: {
              election_id: electionData.id,
              election_name: electionData.name,
              options: electionData.options   
            }
      };
}

// ########################################################################
// ########################################################################
// ###################### DEPLOY chaincode ################################
// ########################################################################
// ########################################################################

 // Step 1 ==================================
    var Ibc1 = require('ibm-blockchain-js');
    var ibc = new Ibc1(/*logger*/);             //you can pass a logger such as winston here - optional
    var chaincode = {};
    var blockChainServiceName = 'ibm-blockchain-5-prod';
    var appIbc = require('.././utils/appIbc.js');

    var peers, users;
    console.log('start loading peers and users from Blockchain service');

    if(process.env.VCAP_SERVICES){      
    console.log('###1');                        //load from vcap, search for service, 1 of the 3 should be found...
      var servicesObject = JSON.parse(process.env.VCAP_SERVICES);
      console.log('###2:'+servicesObject);   
      for(var i in servicesObject){
        console.log('###3:'+i); 
        if(i.indexOf(blockChainServiceName) >= 0){                     //looks close enough
          if(servicesObject[i][0].credentials.error){
            console.log('!\n!\n! Error from Bluemix: \n', servicesObject[i][0].credentials.error, '!\n!\n');
            peers = null;
            users = null;
            process.error = {type: 'network', msg: 'Due to overwhelming demand the IBM Blockchain Network service is at maximum capacity.  Please try recreating this service at a later date.'};
          }
          if(servicesObject[i][0].credentials && servicesObject[i][0].credentials.peers){
            console.log('writting peers, loading from a vcap service: ', i);
            peers = servicesObject[i][0].credentials.peers;
            if(servicesObject[i][0].credentials.users){
              console.log('writting users, loading from a vcap service: ', i);
              users = servicesObject[i][0].credentials.users;
            } 
            else users = null;                            //no security
            break;
          }
        }
      }
    }


    // Step 11
    // ==================================
    // configure ibm-blockchain-js sdk
    // ==================================
    var options =   {
              network:{
                peers: peers,
                users: users,
                options: {quiet: true, tls:false, maxRetry: 1}
              },
              chaincode: {
                zip_url: 'https://github.com/lagache/e-voting-client/archive/master.zip',
                git_url: 'https://github.com/lagache/e-voting-client/tree/master/evoting_chaincode',
                unzip_dir: 'e-voting-client-master/evoting_chaincode',
                deployed_name: '039dc8771292308aa30875cf3e0ef6a2023383c32218deb5012ebe419a6cf273f9a969f3d143d0a4de5069af7fe44164bc3d02495c67b4cb47360324717a7467'
              }
            };

    if(process.env.VCAP_SERVICES){
       // console.log('\n[!] looks like you are in bluemix, I am going to clear out the deploy_name so that it deploys new cc.\n[!] hope that is ok budddy\n');
       // options.chaincode.deployed_name = '';
    }
                                //parse/load chaincode

    var chaincode = null;

    console.log("### before ib.load");
    ibc.load(options, cb_ready);
    console.log("### after ibc.load");

    function cb_ready(err, cc){
      console.log("### into cb_ready");
      chaincode = cc;
      console.log("### chaincode: " + chaincode);


      if(cc && cc.details.deployed_name === ""){                //decide if I need to deploy or not
        cc.deploy('init', ['99'], null, cb_deployed);
      } else{
        console.log('chaincode summary file indicates chaincode has been previously deployed');
        cb_deployed();
      }
                                       //response has chaincode functions
      // if(err != null){
      //   console.log('! looks like an error loading the chaincode or network, app will fail\n', err);
      //   if(!process.error) process.error = {type: 'load', msg: err.details};        //if it already exist, keep the last error
      // }
      // else{
      //   chaincode = cc;
      //    appIbc.setup(ibc, cc);
      //   // part2.setup(ibc, cc);
      //   if(!cc.details.deployed_name || cc.details.deployed_name === ''){         //decide if i need to deploy
      //     cc.deploy('init', ['99'], {save_path: './cc_summaries', delay_ms: 50000}, cb_deployed);
      //   }
      //   else{
      //     console.log('chaincode summary file indicates chaincode has been previously deployed');
      //     cb_deployed();
      //   }
      // }
    }

    // Step 2 ==================================
    //ibc.load(options, cb_ready);  

    //  chaincode.query.getElection(['0001'], function(err, data){
    //     console.log('###query getElection:', data, err);
    // });

    // Step 5 ==================================
    function cb_deployed(err){
        console.log('sdk has deployed code and waited');
        if(chaincode) {
           console.log('### chaincode:', chaincode);
           chaincode.query.getElection(['0001'], function(err, data){
              console.log('###query getElection:', data, err);
              electionData = data;
              console.log('###electionData:', electionData);
           });
        } else {
          console.log('### sniff no chaincode object available');
        }
    }