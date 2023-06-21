const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitals = async(req, res = response) => {

    const hospitals = await Hospital.find().populate('user', 'name image');

    res.json({
        ok: true,
        hospitals
    });
}

const postHospitals = async(req, res = response) => {

    const uid = req.uid;
    const hospital = await new Hospital({
        user: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
    
}

const putHospitals = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital not found by id'
            });
        }

        const hospitalChanges = {
            ...req.body,
            user: uid
        }

        const updatedHospital = await Hospital.findByIdAndUpdate( id, hospitalChanges, { new: true } );

        res.json({
            ok: true,
            hospital: updatedHospital
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const deleteHospitals = async(req, res = response) => {
    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital not found by id'
            });
        }

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital deleted'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

module.exports = {
    getHospitals,
    postHospitals,
    putHospitals,
    deleteHospitals,
}