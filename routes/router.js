const express = require('express')
const router = express.Router()
const {
    list,getSingleData
} = require("../controllers/controllers")

router.route('/cves/list').get(list)
router.route('/cves/:cveId').get(getSingleData)

module.exports = router