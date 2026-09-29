const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
});

module.exports = imagekit;