global.fetch = require('node-fetch');
global.URL = require('url').URL;
import * as log from 'loglevel';
import * as Cognito from '../../src/lib/aws-cognito';
import * as ApiGateway from '../../src/lib/api-gateway-aws';
import * as IoT from '../../src/lib/aws-iot';
import readline from '../../src/lib/readline';
import Config from '../../config';

async function userInput() {
    const username = await readline("Username");
    const password = await readline("Password");
    return { username, password };
}

Cognito.configUserPool({
    poolId: Config.awsCognitoUserPoolId,
    clientId: Config.awsCognitoUserPoolAppClientId,
    identityPoolId: Config.awsCognitoIdentityPoolId
});
ApiGateway.configClient({
    url: Config.awsApiGatewayInvokeUrl
});

userInput()
.then((result) => {
    console.log("username: ", result.username);
    console.log("password: ", result.password);

    return Cognito.loginUser(result.username, result.password)
})
.then(userData => {
    console.log(userData.awsCredentials);
    return ApiGateway.listPolicies()
})
.then(data => {
    console.log(data);
    return Cognito.logoutUser();
})
.then(() => {
    console.log("logout user");
})
.catch(error => {
    console.error(error.message);
});