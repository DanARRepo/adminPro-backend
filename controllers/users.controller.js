const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {

    const from = Number(req.query.from) || 0;
    const [ users, total ] = await Promise.all([
        User.find({}, 'name email role google image').skip( from ).limit( 5 ),
        User.countDocuments()
    ]);

    res.json({
        ok: true,
        users,
        total
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
                    msg: 'User with this email already exists'
                });
            }
        }

        if ( !userDB.google ) {
            fields.email = email;
        } else if ( userDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Users with google email cant change their email address'
            });
        }

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