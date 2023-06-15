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

    // const uid = req.uid;
    // const doctor = await new Doctor({
    //     user: uid,
    // });

    // try {

    //     const doctorDB = await doctor.save();

    //     res.json({
    //         ok: true,
    //         doctor: doctorDB
    //     });
        
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Unexpected error'
    //     });
    // }
    res.json({
        ok: true,
        msg: 'putDoctors'
    });
}

const deleteDoctors = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'deleteDoctors'
    });
}

module.exports = {
    getDoctors,
    postDoctors,
    putDoctors,
    deleteDoctors,
}