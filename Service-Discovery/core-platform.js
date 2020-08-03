const Eureka = require('eureka-js-client').Eureka;
const Express = require('express');

const PlatformClient = new Eureka({

   instance: {
       app: 'Classroom-Platform',
       hostName: 'localhost',
       ipAddr: '127.0.0.1',
       vipAddress: 'localhost',
       port: {
           '$': 3000,
           '@enabled': 'true',
       },

       dataCenterInfo: {
           name: 'Development Environment'
       },

       eureka: {
           host: 'localhost',
           port: 8080,
           servicePath: 'http://localhost:8080/eureka/v2/'
       }
   }

});

PlatformClient.start();

let Service = Express();

Service.listen(3000, console.log("Starting Test Service \n \n \n"));