/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var extend = require('extend');
var Promise = require('bluebird');
//var conversation = require('./lib/conversation');
var weather = require('./lib/weather');
var NaturalLanguageUnderstanding = require('./lib/natural-language-understanding');
var cloudant = require('./lib/cloudant');
var format = require('string-template');
var pick = require('object.pick');
var counter = require('./lib/counter');
//var sendMessageToConversation = Promise.promisify(conversation.message.bind(conversation));
var getUser = Promise.promisify(cloudant.get.bind(cloudant));
var saveUser = Promise.promisify(cloudant.put.bind(cloudant));
var extractCity = Promise.promisify(NaturalLanguageUnderstanding.extractCity.bind(NaturalLanguageUnderstanding));
var getForecast = Promise.promisify(weather.forecastByGeoLocation.bind(weather));
var getGeoLocation = Promise.promisify(weather.geoLocation.bind(weather));

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());




// Create the service wrapper
var conversation = new Conversation({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version_date: '2016-07-01',
  path: {
    workspace_id: process.env.WORKSPACE_ID
  }
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    context: req.body.context || {},
    input: req.body.input || {},
    user :req.body.user 
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    } 
    updateMessage(payload, data).then(function(message){
     // console.log(message);
      if(message.order){
      data.output.text += message.order;
      }
      if(message.menu){
      data.output.text+=message.menu;
      }
      return res.json(data);
      }); 
    
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */



function updateMessage(input, response) {
  var responseText = {};
  var order = {};
  var usere ;
  var dbUser;
  var menu = {"Pizza" : ["Sausage" ,"Pepperoni" , "Spinach and Tomato" ] , 

  "Dessert" : [ "Chocolate Brownie"], "Drink" : [ "Coke" ,"Pepsi"],

   "salad" : ["Garden Salad" , "Ceasers Salad"] };
 
  if (!response.output) {
    response.output = {};
  } 
  var user  = input.user ;
   //console.log(input);
  return getUser(user).then(function(dbUser) {
         

      if(dbUser)
      {order = dbUser.order;
     
        usere =dbUser;
        ;}
      

      return order;
      }).
  then(function(odd){
  
  if (response.intents && response.intents[0]) {
      var intent = response.intents[0];

      console.log(response.context.menu);
      console.log(response.context.order);
      console.log(intent.intent);
      
      if(intent.intent == "menu" && response.context.order==undefined)
      { var d = ""; 
         
         console.log("here");
        if(response.context.menu!=undefined){ 


          menu[response.context.menu].forEach(function(e){
               d = d+"," + e;
              }); 
          }
          else
          {
              d = JSON.stringify(menu);
          }
          delete response.context.menu;
         return d ;
      }
    }
  })
  .then(function(menud){
    if(menud)
      {responseText["menu"] = menud;}
    if (response.intents && response.intents[0]) {
            var intent = response.intents[0];
            
            if(intent.intent =="order" || response.context.order)
                {   
                    delete response.context.order;
                    return  counter.get_cts(input.input.text);
                }

          }
           
  }) .then(function(order_rec){
    
    if(order_rec)
    {      Object.keys(order_rec).forEach(function(key){

        if(order&&order.hasOwnProperty(key))
        {
          order[key] = order[key] + order_rec[key];
       
        
        }
        else
        {
          var temp ={};
          temp[key] = order_rec[key];
         
 
         extend(order , temp); 
      
        }


      });

    }

    return order;

  }) .then(function(ord)
  { if(Object.keys(ord).length!=0){

    responseText["order"] = JSON.stringify(order); 
    }

  if (response.intents && response.intents[0]) {
      var intent = response.intents[0];
      if(intent.intent == "done")
      { 
          order = {};
          delete response.context.order;
      }

    }

  }).

  then(function(){
    
    if(usere){
          
           //console.log(usere);
          // console.log("hereEW");
            usere.order = order;
            return saveUser(usere);
           
          
    }
    else{  //console.log("hereE");
            var newuser = { _id : user , 'order': order };
            return saveUser(newuser);
          }
  


  }) .then(function(saved){
//console.log("sofar");
 responseText["output"]={};
 responseText["output"]["text"] = response.output.text;
return responseText;

  }) ; //current then
  
  

}

module.exports = app;
