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
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version_date: '2016-07-01',
  path: {
    workspace_id: process.env.WORKSPACE_ID
  }
});

/**
* Converts a day number to a string.
*
* @method dayOfWeekAsString
* @param {Number} dayIndex
* @return {Number} Returns day as number
*/
module.exports = {
  /**
   * Sends a message to the conversation. If context is null it will start a new conversation
   * @param  {Object}   params   The conversation payload. See: http://www.ibm.com/watson/developercloud/conversation/api/v1/?node#send_message
   * @param  {Function} callback The callback
   * @return {void}
   */
  message: function(params, callback) {
    // 1. Set today and tomorrow's day of the week
  conversation.message(params, function(err, response) {
     
      if (err) {
        callback(err);
      } else {
       
        callback(null, response);
      }
    });
  }
}
