const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateUser, deleteUser } = require("../controllers/user.controller")
const { upload } = require("../config/supabase")
router.post("/", registerUser)
router.post("/login", loginUser)

router.put("/:id", upload.single("image"), updateUser)

router.delete("/:id", deleteUser)

module.exports = router