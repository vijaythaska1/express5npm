const express = require('express');
const userControoler = require('../controller/userControoler');
const router = express.Router();



router.post("/usercreate", userControoler.userCreate);
router.get("/userFindAll", userControoler.userFindAll);
router.get("/userFindById/:id", userControoler.userFindById);
router.put("/userUpdate/:id", userControoler.userUpdate);
router.delete("/userDelete/:id", userControoler.userDelete);




module.exports = router;
