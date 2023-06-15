const { response } = require("express");

const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const getAll = async (req, res = response) => {

    const searchParam = req.params.search;
    const regex = new RegExp(searchParam, 'i');

    const [users, doctors, hospitals] = await Promise.all([
        User.find({ name: regex }),
        Doctor.find({ name: regex }),
        Hospital.find({ name: regex }),
    ]);

    try {

        res.json({
            ok: true,
            users,
            doctors,
            hospitals,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error'
        });
    }
}

const getDocsCollection = async (req, res = response) => {

    const table = req.params.table;
    const searchParam = req.params.search;
    const regex = new RegExp(searchParam, 'i');

    let data = [];

    switch (table) {
        case 'doctors':
            data = await Doctor.find({ name: regex }).populate('user', 'name image').populate('hospital', 'name image');
            break;

        case 'hospitals':
            data = await Hospital.find({ name: regex }).populate('user', 'name image');
            break;

        case 'users':
            data = await User.find({ name: regex });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'Table must be users/doctors/hospitals'
            });
    }

    try {

        res.json({
            ok: true,
            results: data
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
    getAll,
    getDocsCollection
}