const querystring = require('querystring');
const https = require('https');

/**
 * @function [getValueOf]
 * @param {*} feature Name of the feature
 * @returns {JSON} Value of the feature toggle/flag
 */
const getValueOf = (feature, callback) => {

    https.get('https://featureninjas-db503.firebaseapp.com/f', res => {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', data => {
            body += data;
        })
        res.on('end', () => {
            callback(body);
        });
    });

    // return { enabled: false };
};

/**
 * Used to deploy a new feature set
 * @param {*} path Path to JSON to deploy new feature set
 * @param {*} environment Name of the environment to deploy the feature set to
 */
const deployFeatureSet = (path, environment) => {
    var postData = JSON.stringify({featureA: false});
    console.log(postData);

    var options = {
        hostname: 'featureninjas-db503.firebaseapp.com',
        path:'/admin/deploy',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
    });
};

module.exports = { getValueOf, deployFeatureSet };