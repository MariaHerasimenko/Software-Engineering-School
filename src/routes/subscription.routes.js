const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscription.controller");

router.post("/subscribe", controller.subscribe);
router.get("/confirm/:token", controller.confirm);
router.get("/unsubscribe/:token", controller.unsubscribe);

module.exports = router;
