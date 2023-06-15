// path: /api/hospitals 

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getHospitals, postHospitals, putHospitals, deleteHospitals } = require('../controllers/hospitals.controller');

const router = Router();

router.get( '/' , validateJWT, getHospitals );

router.post( '/', [
    validateJWT,
    check('name', 'Hospital name is required').not().isEmpty(),
    validateFields
], postHospitals );

router.put( '/:id', [], putHospitals );

router.delete( '/:id', deleteHospitals );

module.exports = router;