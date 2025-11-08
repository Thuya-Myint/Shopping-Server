const supabase = require("@supabase/supabase-js")
const multer = require("multer")

const config = require("./config")

const supabaseClient = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE)

const upload = multer({ storage: multer.memoryStorage() })

const uploadImage = async (file) => {

    try {
        const fileName = `${Date.now()}-${file.originalname}`
        const fileStorage = supabaseClient.storage.from(config.SUPABASE_BUCKET)


        const { data, error } = await fileStorage.upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        })

        if (error) {
            console.log("failed to upload image to supabase ", error)
            throw error
        }

        const { data: publicUrl } = fileStorage.getPublicUrl(fileName)

        console.log("publicUrl ", publicUrl.publicUrl)
        return publicUrl.publicUrl

    } catch (error) {
        console.log("uploadImage() error ", error)
    }

}
const uploadImages = async (files) => {
    try {
        const fileStorage = supabaseClient.storage.from(config.SUPABASE_BUCKET);

        const uploadedUrls = [];

        for (const file of files) {

            const fileName = `${Date.now()}-${file.originalname}`;

            const { data, error } = await fileStorage.upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

            if (error) {
                console.log("Failed to upload image:", error);
                throw error;
            }

            const { data: publicUrl } = fileStorage.getPublicUrl(fileName);

            uploadedUrls.push(publicUrl.publicUrl);
        }

        return uploadedUrls;

    } catch (error) {
        console.log("uploadImages() error", error);
        throw error;
    }
};
module.exports = {
    uploadImage,
    upload,
    uploadImages,
    uploadMultiple: upload.array("images", 10)
}