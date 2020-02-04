const { Storage } = require('@google-cloud/storage');

const storage = new Storage({keyFilename: "../service-account.json"});
const bucketName = 'gs://showcaseit.appspot.com';
const fileExpiration = 1000 * 60 * 60 * 24 * 90; // expires in 90 days

const generateSignedUrl = async (fileName) => {
  const options = {
    action: 'read',
    expires: Date.now() + fileExpiration,
  };

  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);
  
  return url;
}

const upload = async (srcPath) => {
  const res = await storage.bucket(bucketName).upload(srcPath);
  const fileName = res[1].name;
  return generateSignedUrl(fileName);
};

module.exports = upload;