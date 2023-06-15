// path: api/all/:search 

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getAll, getDocsCollection } = require('../controllers/search.controller');

const router = Router();

router.get( '/:search', validateJWT, getAll );

router.get( '/collection/:table/:search', validateJWT, getDocsCollection );

module.exports = router