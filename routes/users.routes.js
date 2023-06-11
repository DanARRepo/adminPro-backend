// path: /api/users 

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getUsers, postUsers, updateUser, deleteUser } = require('../controllers/users.controller');

const router = Router();

router.get( '/', validateJWT ,getUsers );

router.post( '/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    validateFields,
], postUsers );

router.put( '/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('role', 'Role is required').not().isEmpty(),
    validateFields
], updateUser );

router.delete( '/:id', validateJWT, deleteUser );

module.exports = router;