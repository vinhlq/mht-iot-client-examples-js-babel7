global.fetch = require('node-fetch');
global.URL = require('url').URL;
import * as log from 'loglevel';
import * as Cognito from '../../lib/aws-cognito';
import * as ApiGateway from '../../lib/api-gateway';
import * as IoT from '../../lib/aws-iot';

import readline from '../../lib/readline';

async function userInput() {
  const username = await readline("Username");
  const password = await readline("Password");
  return {username, password};
}

userInput()
.then((result) => {
    console.log("username: ", result.username);
    console.log("password: ", result.password);

    return Cognito.loginUser(result.username, result.password)
})
.then(userData => {
    console.log(userData.awsCredentials);
    return ApiGateway.adminGetUser(userData.userObj.username)
})
.then(userAttributes => {
    console.log('User attributes', userAttributes);
    return Cognito.logoutUser();
})
.then(() => {
    console.log("logout user");
})
.catch(error => {
    console.error(error.message);
});