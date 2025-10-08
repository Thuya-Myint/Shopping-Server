require("dotenv").config()

const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGODB_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    SALT: process.env.SALT,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
    SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_UNIT_KEY: process.env.REDIS_UNIT_KEY,
    REDIS_TTL: process.env.REDIS_TTL,
    JWT_TTL: process.env.JWT_TTL
}
module.exports = config