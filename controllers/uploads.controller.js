const path = require('path');
const fs =  require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require("../helpers/update-image");

const uploadFiles = (req, res = response) => {

    const { type, id } = req.params;

    const validTypes = ['hospitals', 'doctors', 'users'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'There is no valid Type: hospitals, doctors, users'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'There are no files'
        });
    }

    const file = req.files.image;

    const nameCut = file.name.split('.');
    const fileExtension = nameCut[nameCut.length - 1];

    // Validar extension 
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            msg: 'Please use a valid extension'
        });
    }

    // Generear nombre archivo 
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Path imagen 
    const path = `./uploads/${type}/${fileName}`;

    // Mover la imagen 
    file.mv( path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error trying to move the image'
            });
        }

        // Actualizar base de datos 
        updateImage( type, id, fileName );

        res.json({
            ok: true,
            msg: 'File uploaded!',
            fileName
        });

    });
}

const returnImg = ( req, res = response ) => {
    const { type, image } = req.params;
    const pathImg = path.join( __dirname, `../uploads/${type}/${image}`);

    if ( fs.existsSync(pathImg) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, '../uploads/no-img.jpg');
        res.sendFile( pathImg );
    }
    
}

module.exports = { 
    uploadFiles,
    returnImg 
}