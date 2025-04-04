const Consul = require('consul');

const CONSUL_HOST = "consul-hn1i.onrender.com";
const CONSUL_PORT = 443;

const consul = new Consul({
    host: CONSUL_HOST,
    port: CONSUL_PORT,
    promisify: true,
    secure: true,
    timeout: 300000 // Increased timeout
});

// Service registration details
const CONSUL_SERVICE_ID = "Express_User";
const CONSUL_SERVICE_NAME = "Express_User";
const SERVICE_HOST = "express-user-ccqv.onrender.com";
const SERVICE_PORT = 7000;

// Register service in Consul
const registerService = () => {
    consul.agent.service.register({
        id: CONSUL_SERVICE_ID,
        name: CONSUL_SERVICE_NAME,
        address: SERVICE_HOST,
        port: SERVICE_PORT
    }, (err) => {
        if (err) {
            console.error("❌ Consul registration failed:", err.message);
        } else {
            console.log("✅ User Service successfully registered in Consul");
        }
    });
};

// Keep Consul connection alive
setInterval(() => {
    consul.agent.self((err, result) => {
        if (err) {
            console.error("❌ Consul connection lost. Reconnecting...");
            registerService();
        } else {
            console.log("✅ Consul connection is active.");
        }
    });
}, 30000); // Every 30 seconds

// Gracefully deregister service on shutdown
process.on('SIGINT', async () => {
    try {
        await consul.agent.service.deregister(CONSUL_SERVICE_ID);
        console.log("✅ User Service deregistered from Consul");
        process.exit();
    } catch (err) {
        console.error("❌ Error deregistering service:", err.message);
        process.exit(1);
    }
});

module.exports = consul;
