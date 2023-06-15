// path: api/upload/:id

const { Router } = require('express');
const fileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/validate-jwt');

const { uploadFiles, returnImg } = require('../controllers/uploads.controller');

const router = Router();

router.use(fileUpload());

router.put( '/:type/:id', validateJWT, uploadFiles );
router.get( '/:type/:image', returnImg );

module.exports = router