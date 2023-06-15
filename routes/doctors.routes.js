// path: /api/doctors 

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getDoctors, postDoctors, putDoctors, deleteDoctors, } = require('../controllers/doctors.controller')

const router = Router();

router.get( '/' , validateJWT, getDoctors );

router.post( '/', [
    validateJWT,
    check('name', 'Doctors name is required').not().isEmpty(),
    check('hospital', 'Hospital id must be valid').isMongoId(),
    validateFields
], postDoctors );

router.put( '/:id', [], putDoctors );

router.delete( '/:id', deleteDoctors );

module.exports = router;