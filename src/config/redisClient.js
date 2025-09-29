const { createClient } = require("redis");
const config = require("./config");

let client;

const connectRedis = async () => {
    try {
        client = createClient({
            username: config.REDIS_USERNAME,
            password: config.REDIS_PASSWORD,
            socket: {
                host: config.REDIS_HOST,
                port: config.REDIS_PORT
            }
        });
        if (!client) return console.log("redis client failed to create!")

        await client.connect();
        client.on("error", () => console.log("error connecting redis client"))
        client.on("success", () => console.log("redis successfully connected!"))
    } catch (error) {
        console.log("crate reids client error ", error)
    }
}

const setCache = async (key, data) => {
    try {

        await client.set(key, JSON.stringify(data), "EX", config.REDIS_TTL)

    } catch (error) {
        console.log("set cache error", error)
    }
}
const getCache = async (key) => {
    try {
        const cachedData = await client.get(key)
        return cachedData

    } catch (error) {
        console.log("get cache error", error)
    }
}
const clearCache = async (key) => {
    try {
        await client.del(key)
    } catch (error) {
        console.log("clear cache error", error)
    }
}
module.exports = { connectRedis, setCache, getCache, clearCache }
