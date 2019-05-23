const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/user');

router.delete("/:id", ctrlUsers.delUser);

router.get("/", ctrlUsers.getAllUsers);

router.get('/:id', ctrlUsers.getUsers);

router.post('/', ctrlUsers.addUser);

module.exports = router;