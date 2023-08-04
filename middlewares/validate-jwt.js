const { response } = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const validateJWT = (req, res = response, next) => {

    // Leer token 
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }

}

const validateAdminRole = async(req, res = response, next) => {

    const uid = req.uid;

    try {
        
        const userDB = await User.findById(uid);

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'User doesnt exist'
            })
        }

        if ( userDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'You dont have permission to do this action'
            })
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong, call admin'
        })
    }
}

const validateSameRole = async(req, res = response, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {
        
        const userDB = await User.findById(uid);

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'User doesnt exist'
            })
        }

        if ( userDB.role === 'ADMIN_ROLE' || uid === id ) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'You dont have permission to do this action'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong, call admin'
        })
    }
}

module.exports = { 
    validateJWT,
    validateAdminRole,
    validateSameRole
}