const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require("../helpers/jwt");

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
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

module.exports = { login }