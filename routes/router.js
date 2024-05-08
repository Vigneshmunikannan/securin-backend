const express = require('express')
const router = express.Router()
const {
    list,getSingleData
} = require("../controllers/controllers")

router.route('/list').get(list)
router.route('/getsingledata/:cveId').get(getSingleData)

module.exports = router