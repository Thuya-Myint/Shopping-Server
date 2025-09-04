const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateUser, deleteUser } = require("../controllers/user.controller")

router.post("/", registerUser)
router.post("/login", loginUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)


module.exports = router