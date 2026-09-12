const imagekit = require("../config/imagekit");

const uploadImage = async (file, fileName, folder) => {
    if (!file) {
        throw new Error("No image file provided");
    }

    const result = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName,
        folder
    });

    return result;
};

module.exports = {
    uploadImage
};