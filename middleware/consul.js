const Consul = require('consul');
const consul = new Consul({
    host: "54.80.58.38",
    port: 8500,
    promisify: true,
    secure: false,
    timeout: 200000
});
// const dotenv = require('dotenv');
// dotenv.config();

const CONSUL_SERVICE_ID = "Express_User" //process.env.CONSUL_SERVICE_ID;
const CONSUL_SERVICE_NAME = "Express_User" //process.env.CONSUL_SERVICE_NAME ;
const SERVICE_HOST = "127.0.0.1" //process.env.CONSUL_HOST;
const SERVICE_PORT =  7000;


// register expert service in consul discovery server
consul.agent.service.register({
    id: CONSUL_SERVICE_ID,
    name: CONSUL_SERVICE_NAME,
    address: SERVICE_HOST,
    port: SERVICE_PORT,
},
(err)=>{
    if(err)
        throw err;
    console.log('User Service successfully registered')
})
// Gracefully deregister service when shutting down
process.on('SIGINT', async () => {
    try {
        await consul.agent.service.deregister('Express_Poc');
        console.log('User Service deregistered from Consul');
        process.exit();
    } catch (err) {
        console.error('Error deregistering service:', err);
        process.exit(1);
    }
});
module.exports = consul;