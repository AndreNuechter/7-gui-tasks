require('dotenv').config();

module.exports = (_, config) => {
    config.env.PORT = process.env.PORT;
    return config;
};
