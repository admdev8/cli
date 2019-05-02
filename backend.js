const querystring = require('querystring');
const https = require('http');
const NodeRequestClient = require('node-rest-client').Client;
const inquirer = require('inquirer');

var rr = new NodeRequestClient();

/**
 * @function [getValueOf]
 * @param {*} feature Name of the feature
 * @returns {JSON} Value of the feature toggle/flag
 */
const requestTokenList = (callback) => {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'projectKey',
                message: 'Project key'
            }
        ])
        .then(answers => {

            var projectKey = answers.projectKey;
            
            rr.get('http://localhost:61866/api/project/tokens/request', function(data, response) {
                // console.log(data);
                if (response.statusCode = 200) {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'otp',
                                message: 'One time password (OTP)'
                            }
                        ])
                        .then(answers => {
                            console.log(answers);
                        });
                }
                
            });

        });

    

    // https.get('http://localhost:61866/api/project/tokens/request', res => {
    //     res.setEncoding('utf8');
    //     var body = "";
    //     res.on('data', data => {
    //         body += data;
    //     })
    //     res.on('end', () => {
    //         callback(body);
    //     });
    // });

    // return { enabled: false };
};

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

module.exports = { requestTokenList, getValueOf, deployFeatureSet };