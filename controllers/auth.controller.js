const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // verificar email 
        const userDB = await User.findOne({ email });

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Password or email are not correct'
            });
        }

        // verificar password 
        const validatePassword = bcrypt.compareSync( password, userDB.password );
        if ( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        // Generar el token - JWT
        const token = await generateJWT( userDB.id );

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const googleSignIn = async( req, res = response ) => {

    try {
        const { name, email, picture } = await googleVerify( req.body.token );

        const userDB = await User.findOne({ email });
        let user;

        if ( !userDB ) {
            user = new User({
                name,
                email,
                password: '@@@',
                image: picture,
                google: true
            });
        } else {
            user = userDB;
            user.google =  true;

        }

        // Guardar usuario 
        await user.save();

        // Generar token - JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            name,
            email,
            picture
        })

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Invalid Google token'
        });
    }

}

module.exports = { 
    login,
    googleSignIn
}