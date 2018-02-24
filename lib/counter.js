#!/usr/bin/env
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
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk


var conversation = new Conversation({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version_date: '2016-07-01',
  path: {
    workspace_id: process.env.WORKSPACE_ID
  }
});

var Promise = require('bluebird');
var extend = require('extend');

function  get_counts(inp){


//var inp = 'I want 4 pizzas , 2  spinach and tomatoes pizzas and 2 sausage pizzas and  not 2 coke' ;

var Promise = require('bluebird');
var extend = require('extend');

var Small = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90
};


var request = require('sync-request');


var Promise = require('bluebird');

conversation.message = Promise.promisify(conversation.message);

var payload = {
    				"input": { "text" : inp },
  			   };	

return conversation.message(payload).

then(function(parsed){

var d = inp.slice(0, inp.length);
 
 var replacements = {
 
"chocolate brownie": "cb" ,
"fountain drink" : "fd",
"Pizza" : "pz" , "Dessert" : "ds", "Drink" : "dr", "salad" : "sl",
"garden salad" : "gs" , "ceasers salad" : "cs" ,
"4 cheese" : "cpz" , "pepperoni" : "ppz", "sausage" : "spz", "Spinach and tomato" : "tpz"
 }


 var cats = {"Pizza" : "pz" , "Dessert" : "ds", "Drink" : "dr", "salad" : "sl"};

var reversed = {};
  for(var key in replacements){
    reversed[replacements[key]] = key;
  }

var allowed = [ "chocolate brownie" , "fountain drink" , "ceasers salad" ,"garden salad" ,"4 cheese" , "pepperoni" , "sausage" , "Spinach and tomato" ];

if(parsed.entities.length!=0)
{	var x = parsed.entities.slice(0 , parsed.entities.length)
	var j = 0 ;
	for (var i = 0; i < parsed.entities.length; i++) 
		{  		
				var f = 0 ;
				parsed.entities[i]["original"] = inp.slice(parsed.entities[i].location[0] , parsed.entities[i].location[1]);
				delete parsed.entities[i].confidence;
				delete parsed.entities[i].metadata;
				for (var j = 0; j < x.length; j++) 
						{
						if((parsed.entities[i].location[0] >= x[j].location[0] )&& (x[j].location[1]  >= parsed.entities[i].location[1]) && (i!=j))
							{ 
								f=1;
							
							}
					}
				
				if(f==1){
					
					delete parsed.entities[i];
					
					
					}
		};

		//console.log(parsed.entities);
		
		for (var i = 0; i < parsed.entities.length; i++) 
		{						
			if(parsed.entities[i]!=null||parsed.entities[i]!=undefined){	

				
				
				if(replacements.hasOwnProperty(parsed.entities[i].value)){
								//console.log(parsed.entities[i]);
								var rpstr = replacements[parsed.entities[i].value];
								var str = new Array((parsed.entities[i].original.length - rpstr.length)+1).join(" ");
								d = d.substring(0,parsed.entities[i].location[0]) + str + rpstr + d.substring(parsed.entities[i].location[1]);
		//							console.log(parsed.entities[i].location);
		//							console.log(":" + d +":");	
					}
				}	
		}			 			
		
			 		

   var res = request('POST', 'http://localhost:9000/?properties={"annotators":"udfeats"}', {
     		json: { "data" :d },
       		} );


 	var num = JSON.parse(res.getBody('utf8')).sentences[0].basicDependencies;
    var data  = {};
    var compounds = {};

    //console.log(num);
    
    num.forEach(function(e){
      if(e.dep == "nummod")
        {  var temp = { };
    		
    		
            if(Small.hasOwnProperty(e.dependentGloss))
            {
            e.dependentGloss = Small[e.dependentGloss];
            }
            else if (parseInt(e.dependentGloss)!=NaN)
            {
              e.dependentGloss = parseInt(e.dependentGloss);
            } 
            else
            {
              e.dependentGloss = 0;
            }
            
      
            /*if(SpellChecker.isMisspelled(e.governorGloss))
              {
                e.governorGloss = SpellChecker.getCorrectionsForMisspelling(e.governorGloss);
              } */
             if(reversed[e.governorGloss])  
	         {  if(allowed.indexOf( reversed[e.governorGloss] ) != -1 ){
	            	temp[reversed[e.governorGloss]]=  e.dependentGloss;

	          		if(!data[reversed[e.governorGloss]]) 
	          			{
	          				extend(data, temp);
	          			}
	          		else{
	          			data[reversed[e.governorGloss]] += e.dependentGloss;
	          		} 
	          	}	
          }

        }
        if(e.dep == "det")
	     {   
	     		   
             if(reversed[e.governorGloss])  
	         {  if(allowed.indexOf( reversed[e.governorGloss] ) != -1 )
	         	{
	        
		        if(!data[reversed[e.governorGloss]]) 
		          		{ 
		          		var temp = { };
		            	temp[reversed[e.governorGloss]] = 1;
		            	extend(data, temp);
		            	}
		            else
		            {
		            	data[reversed[e.governorGloss]] +=1;	
		            }	
	        	}
	    	}
        }
         		   
             if(reversed[e.governorGloss])  
	         {  if(allowed.indexOf( reversed[e.governorGloss] ) != -1 )
	         	{
	        
		        if(!data[reversed[e.governorGloss]]) 
		          		{ 
		          		var temp = { };
		            	temp[reversed[e.governorGloss]] = 1;
		            	extend(data, temp);
		            	}
		
	        	}
	    	}
        
    });

parsed.entities.forEach(function(e){

if(!data.hasOwnProperty(e.value))
{	if(!cats.hasOwnProperty(e.value))
	 {data[e.value] = 1; }
}

}); 



} // big if


 return data;
 


}); //then




}

//var x  =  Promise.promisify(get_counts);
module.exports = { get_cts: get_counts
}