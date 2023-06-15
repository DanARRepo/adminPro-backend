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

const putHospitals = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PutHospitals'
    });
}

const deleteHospitals = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'DeleteHospitals'
    });
}

module.exports = {
    getHospitals,
    postHospitals,
    putHospitals,
    deleteHospitals,
}