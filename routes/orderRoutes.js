const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

router.route("/").post(orderController.checkBody, orderController.postOrder).get(orderController.getOrder)

module.exports = router;