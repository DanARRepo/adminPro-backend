// path: /api/login 

const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('token', 'Google token is required').not().isEmpty(),
    validateFields
], googleSignIn );

module.exports = router;