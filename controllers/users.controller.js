const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {

    const users = await User.find({}, 'name email role google'); 
    
    res.json({
        ok: true,
        users,
        uid: req.uid
    });
}

const postUsers = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exists'
            });
        }

        const user = new User( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Generar usuario 
        await user.save();

        // Generar el token - JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error... check logs'
        });
    }

}

const updateUser = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // TODO: Validar token y comprobar si es el usuario correcto

        const userDB = await User.findById( uid );

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No user exists with this id'
            });
        }

        // Actualizaciones 
        const { password, google, email, ...fields } = req.body;

        if (userDB.email !== email ) {
            const emailExists = await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({
                    ok: false,
                    msg: 'user with this email already exists'
                });
            }
        }

        fields.email = email;

        const updatedUser = await User.findByIdAndUpdate( uid, fields, {new: true} );

        res.json({
            ok: true,
            user: updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

const deleteUser = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const userDB = await User.findById( uid );

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No user exists with this id'
            });
        }

        await User.findByIdAndDelete( uid );
        
        res.json({
            ok: true,
            msg: 'User deleted'
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Unexpected error'
        })
    }
}

module.exports = {
    getUsers,
    postUsers,
    updateUser,
    deleteUser
}