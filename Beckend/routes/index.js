const express = require('express');
const userControoler = require('../controller/userControoler');
const authControoler = require('../controller/authControoler');
const header = require('../middleware/header');
const router = express.Router();



router.post("/login", header.asyncMiddleware, authControoler.login);
router.post("/usercreate", header.asyncMiddleware, header.authenticateToken, userControoler.userCreate);
router.get("/userFindAll", header.asyncMiddleware, header.authenticateToken, userControoler.userFindAll);
router.get("/userFindById/:id", header.asyncMiddleware, header.authenticateToken, userControoler.userFindById);
router.put("/userUpdate/:id", header.asyncMiddleware, header.authenticateToken, userControoler.userUpdate);
router.delete("/userDelete/:id", header.asyncMiddleware, header.authenticateToken, userControoler.userDelete);




module.exports = router;
