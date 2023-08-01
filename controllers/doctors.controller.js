const { response } = require('express');
const Doctor = require('../models/doctor.model');

const getDoctors = async(req, res = response) => {

    const doctors = await Doctor.find().populate('user', 'name image')
                                        .populate('hospital', 'name')
    
    res.json({
        ok: true,
        doctors
    })
}

const getDoctorById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id)
            .populate('user', 'name image')
            .populate('hospital', 'name')
        
        res.json({
            ok: true,
            doctor
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Somthing went wrong, talk to admin'
        })
    }
}

const postDoctors = async(req, res = response) => {
    const uid = req.uid;
    const doctor = await new Doctor({
        user: uid,
        ...req.body
    });

    try {
        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorDB,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const putDoctors = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const doctorDB = await Doctor.findById(id);

        if ( !doctorDB ) {
            return res.status(404).json({
                ok: true,
                msg: 'Doctor not found by id'
            });
        }

        const doctorChanges = {
            ...req.body,
            user: uid
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate( id, doctorChanges, { new: true } );

        res.json({
            ok: true,
            dorctor: updatedDoctor
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const deleteDoctors = async(req, res = response) => {
    const id = req.params.id;

    try {

        const doctorDB = await Doctor.findById(id);

        if ( !doctorDB ) {
            return res.status(404).json({
                ok: true,
                msg: 'Doctor not found by id'
            });
        }

        await Doctor.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Doctor deleted'
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
    getDoctors,
    postDoctors,
    putDoctors,
    deleteDoctors,
    getDoctorById
}