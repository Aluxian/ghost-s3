// # S3 Image Storage module
// Module for storing images using an AWS S3 bucket

var fs        = require('fs'),
    path      = require('path'),
    util      = require('util'),
    Promise   = require('bluebird'),
    AWS       = require('aws-sdk'),
    errors    = require('../errors'),
    config    = require('../config'),
    baseStore = require('./base'),
    s3        = new AWS.S3(config.aws);

function S3FileStore() {}
util.inherits(S3FileStore, baseStore);

// Saves the image into the bucket
// - image is the express image object
// - returns a promise which ultimately returns the full url to the uploaded image
S3FileStore.prototype.save = function (image) {
    var filename = this.getUniqueFileKey(image);
    var readFile = Promise.promisify(fs.readFile);
    var putObject = Promise.promisify(s3.putObject.bind(s3));

    return readFile(image.path).then(function (buffer) {
        return putObject({
            Bucket: config.aws.bucket,
            Key: filename,
            ACL: 'public-read',
            Body: buffer,
            ContentType: image.type,
            CacheControl: 'max-age=' + (30 * 24 * 60 * 60) // 30 days
        });
    }).then(function (result) {
        if (config.aws.cloudfront) {
            return 'https://' + config.aws.cloudfront + '.cloudfront.net/' + filename;
        } else {
            return 'https://' + config.aws.bucket + '.s3.amazonaws.com/' + filename;
        }
    }).catch(function (e) {
        errors.logError(e);
        return Promise.reject(e);
    });
};

// Generate a unique Key used to store the S3 object
S3FileStore.prototype.getUniqueFileKey = function (image) {
    var ext = path.extname(image.name),
    name = path.basename(image.name, ext).replace(/[\W]/gi, '-')
    timestamp = Date.now();

    return path.join(this.getTargetDir(), name + '-' + timestamp + ext);
};

// Always return false since filenames are already unique
S3FileStore.prototype.exists = function (url) {
    return new Promise(function (resolve) {
        resolve(false);
    });
};

// No serving needed, so just do next()
S3FileStore.prototype.serve = function () {
    return function (req, res, next) {
        next();
    };
};

module.exports = S3FileStore;
