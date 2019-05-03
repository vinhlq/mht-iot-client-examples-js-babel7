global.fetch = require('node-fetch');
global.URL = require('url').URL;
import { pki } from 'node-forge';
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
    return ApiGateway.listCertificates()
})
.then(data => {
  console.log(data);

  var certs = [];

  for(let i = 0; i < data.certificates.length; i++) {
    certs.push(new Promise((resolve, reject) => {
      var params = {
        certificateId: data.certificates[i].certificateId
      };
      return ApiGateway.describeCertificate(params)
      .then(data => {
        const cert = pki.certificateFromPem(data.certificateDescription.certificatePem);
        const thumbprint = pki.getPublicKeyFingerprint(cert.publicKey, {encoding: 'hex'});
        const thumbprint64 = Buffer.from(thumbprint, 'hex').toString('base64');
        console.log(cert.serialNumber);
        console.log(thumbprint64);
        console.log(cert.subject.getField('CN').value);
        if(cert.subject.getField('CN').value === 'test-registrationCode1'){
          resolve({cert: cert, index: i});
        }
        else{
          reject(new Error(`No match certificate:  ${i}`))
        }
      });
    }));
  }
  // return Promise.race(certs);
  return Promise.all(certs);
})
.then((data) => {
  console.log(data);
  Cognito.logoutUser();
})
.catch(error => {
    console.error(error.message);
    Cognito.logoutUser();
})