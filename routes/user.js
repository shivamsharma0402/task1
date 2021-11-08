const express= require('express');
const router = express.Router();
const {
    createUser,
    readUser,
    updateUser,
    deleteUser 
  } = require('../controllers/userController');

const isAuth = require('../middleware/is-auth');


router.route('/createUser').post(createUser);
router.get('/readUser',readUser);
router.put('/updateUser', isAuth, updateUser);
router.delete('/deleteUser', isAuth, deleteUser);

module.exports=router;


