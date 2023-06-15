const fs = require('fs');

const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const deleteImg = ( path ) => {
    if ( fs.existsSync(path) ) {
        fs.unlinkSync( path );
    }
}

const updateImage = async(type, id, fileName) => {

    let oldPath = '';

    switch ( type ) {
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if ( !doctor ) {
                console.log('Is not a doctor');
                return false;
            }

            oldPath = `./uploads/doctors/${ doctor.image }`;
            deleteImg( oldPath );

            doctor.image = fileName;
            await doctor.save();
            return true;

            break;

        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if ( !hospital ) {
                console.log('Is not a hospital');
                return false;
            }

            oldPath = `./uploads/hospitals/${ hospital.image }`;
            deleteImg( oldPath );

            hospital.image = fileName;
            await hospital.save();
            return true;
            break;
        case 'users':
            const user = await User.findById(id);
            if ( !user ) {
                console.log('Is not a user');
                return false;
            }

            oldPath = `./uploads/users/${ user.image }`;
            deleteImg( oldPath );

            user.image = fileName;
            await user.save();
            return true;
            
            break;
    }
}

module.exports = {
    updateImage
}