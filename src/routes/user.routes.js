const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateUser, deleteUser, getAllAdmin, updateUserRole } = require("../controllers/user.controller")
const { upload } = require("../config/supabase")
const { verifyToken } = require("../helper/authJwt")
const { allowedRole } = require("../helper/common.helper")

router.post("/", registerUser)
router.post("/login", loginUser)
router.put("/:id", upload.single("image"), updateUser)
router.get("/admin", verifyToken, getAllAdmin)
router.delete("/:id", deleteUser)
router.put("/role/:id", verifyToken, allowedRole("super-admin"), updateUserRole)

module.exports = router