// libs/logger.js

const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] LOG: ${message}`);
};

const error = (message) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
};

module.exports = { log, error };
