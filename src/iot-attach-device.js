global.fetch = require('node-fetch');
global.URL = require('url').URL;
import { pki } from 'node-forge';
import * as log from 'loglevel';
import * as Cognito from '../../lib/aws-cognito';
import * as ApiGateway from '../../lib/api-gateway';
import * as IoT from '../../lib/aws-iot';

import readline from '../../lib/readline';

async function userInput() {
  const username = await readline("Username");
  const password = await readline("Password");
  const serialNumber = await readline("Serial Number");
  return {username, password, serialNumber};
}

userInput()
.then(data => {
  Cognito.loginUser(data.username, data.password)
  .then(userData => {
    console.log(userData.awsCredentials);
    return ApiGateway.attachDevice(data.serialNumber);
  })
  .then(data => {
    console.log(data);
  });
})