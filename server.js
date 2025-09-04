const express = require('express')
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()
const config = require("./src/config/config")
const port = config.PORT
const mongodb_url = config.MONGO_URL
const userRoute = require("./src/routes/user.routes")
const unitRoute = require("./src/routes/unit.routes")
const categoryRoute = require("./src/routes/category.routes")
const productRoute = require("./src/routes/product.routes")
const sizeRoute = require("./src/routes/size.routes")
const cors = require("cors")


app.use(express.json())
app.use(cors(
    'http://localhost:3000',
    'http://localhost:7500'
))
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})
app.get('/', (req, res) => {
    res.send("Api start working!")
})

app.use("/api/v1/user", userRoute)
app.use("/api/v1/unit", unitRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/size", sizeRoute)

mongoose.connect(mongodb_url).then(() => console.log("Mongo Db Successfully connected!")).catch(() => console.log("error connecting to mongo!"))
