const Express = require('express');
const TokenProvider = require('../Utilities/token-provider');

let TokenAPI = Express.Router();

 TokenAPI.get('/dev/token/generate', (error, token) => {
 });