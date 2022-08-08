const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const customHeader = require('../middleware/customHeader');
const checkRole = require('../middleware/role');
const authMiddleware = require('../middleware/session');

//TODO http://localhost/3000/users

router.get('/', userController.show_users);

router.delete('/delete/:id', userController.delete_user);

router.get('/students', userController.show_students);

router.get('/students/assigned', userController.show_students_assigned)

router.get('/teachers', userController.show_teachers);

router.get('/role', userController.user_role);

router.get('/students/profile', userController.user_profile);

router.post('/assign/case', userController.assign_case);

router.post('/unassign/case', userController.unassign_case);


module.exports = router;




