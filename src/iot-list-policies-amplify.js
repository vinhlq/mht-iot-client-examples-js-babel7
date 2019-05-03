global.fetch = require('node-fetch');
global.URL = require('url').URL;
import * as log from 'loglevel';
import Config from '../../config';
import Amplify from '@aws-amplify/core';
// import Amplify from "aws-amplify";
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';
import ApiGateway from '../../src/lib/api-gateway-amplify';
import * as IoT from '../../src/lib/aws-iot';

import readline from '../../src/lib/readline';

async function userInput() {
  const username = await readline("Username");
  const password = await readline("Password");
  return { username, password };
}

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: Config.awsRegion,
        userPoolId: Config.awsCognitoUserPoolId,
        identityPoolId: Config.awsCognitoIdentityPoolId,
        userPoolWebClientId: Config.awsCognitoUserPoolAppClientId
    },
    API: {
        endpoints: [
            {
                name: "mht-iot-api",
                endpoint: Config.awsApiGatewayInvokeUrl,
                region: Config.awsRegion,
                // custom_header: async () => {
                //     return { Authorization: (await Auth.currentSession()).idToken.jwtToken };
                // }
            },
        ]
    }
});
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const configure = Auth.configure();
console.log(configure);
console.log(configure.Auth);
console.log(configure.API.endpoints[0]);

const api = new ApiGateway({ name: "mht-iot-api" });
// ApiGateway.configClient({ name: "mht-iot-api" });

userInput()
.then((result) => {
    console.log("username: ", result.username);
    console.log("password: ", result.password);

    // ApiGateway.configClient("https://y6umqallae.execute-api.ap-southeast-1.amazonaws.com/prod");
    return Auth.signIn(result.username, result.password);
})
.then(user => {
    // console.log(user.awsCredentials);
    // return ApiGateway.listPolicies()
    return api.listPolicies()
})
.then(data => {
    console.log(data);
})
.then(() => {
    console.log("logout user");
})
.catch(error => {
    console.error(error);
});