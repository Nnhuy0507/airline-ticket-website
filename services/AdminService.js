const flightModel = require('../models/Flight');
const airlineModel = require('../models/Airline')
const userModel = require('../models/User')
const {mongooseToObject} = require('../util/mongoose');
class AdminService {
    createFlight = async (req) => {
        try {
            flightModel.create(req)
            // console.log(req);
        } catch (error) {
            throw error
        }
    }

    deleteFlight = async (id) => {
        try {
            flightModel.findByIdAndDelete(id).exec()
        } catch (error) {
            throw error
        }
    }

    updateFlight = async (req) => {
        try {
            flightModel.findByIdAndUpdate(req._id, req).exec()
        } catch (error) {
            throw error
        }
    }

    createAirline = async (req) => {
        try {
            airlineModel.create(req)
        } catch (error) {
            throw error
        }
    }

    deleteAirline = async (id) => {
        try {
            airlineModel.findByIdAndDelete(id).exec()
        } catch (error) {
            throw error
        }
    }

    updateAirline = async (req) => {
        try {
            airlineModel.findByIdAndUpdate(req._id, req).exec()
        } catch (error) {
            throw error
        }
    }

    deleteUser = async (id) => {
        try {
            userModel.findByIdAndDelete(id).exec()
        } catch (error) {
            throw error
        }
    }

    updateUser = async (req) => {
        try {
            userModel.findByIdAndUpdate(req._id, req).exec()
        } catch (error) {
            throw error
        }
    }

    updateVerify = async (id) => {
        try {
            const user = userModel.findById(id)
            .then((user) => {
                const data = mongooseToObject(user);
                const new_verified = !data.verified
                user.updateOne({verified: new_verified}).exec()
            })
        } catch (error) {
            throw error
        }
    }


    updateStatus = async (ticketId, status) => {
    try {
        return ticketModel.findByIdAndUpdate(
            ticketId,
            { status: status },
            { new: true }
        )
    } catch (error) {
        throw error;
    }
}

}

module.exports = new AdminService;