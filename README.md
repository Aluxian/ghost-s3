# Ghost: S3 File Store module

AWS S3 file storage module for Ghost blogs.

## Install

1. Copy the `s3.js` file to `core/server/storage/`
2. Change `storageChoice` in `core/server/storage/index.js:7` to `s3`
3. Add `aws-sdk` to dependencies in your `package.json`

## Configure

In your Ghost config.js file, under "development" and/or "production", add:

```javascript
aws: {
    accessKeyId: 'your AWS access key id',
    secretAccessKey: 'your AWS secret access key',
    bucket: 'your bucket name',
    region: 'the AWS region your bucket is in; e.g.: eu-west-1',
    cloudfront: 'the cloufront domain; e.g.: djq7m1gww7pf8e' // Optional
}
```

The `cloudfront` key is optional and should only be filled is Cloudfront is
being used as a content distribution network. Is the option is not present, the
files will be served directly from S3.

Note: for enhanced security, it is recommended that you use environment variables instead of hard-coding the values in your config.js file.

## Updates

Until Ghost has a plugin system in place, this will be the only way to use S3 storage for your Ghost blog. I will try to update this repository to support future versions of Ghost.
