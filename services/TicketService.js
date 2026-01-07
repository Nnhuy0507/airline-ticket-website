const {mongooseToObject} = require('../util/mongoose');
const ticketModel = require('../models/Ticket')
const Flight = require("../models/Flight");
const { multipleMongooseToObject } = require("../util/mongoose");
class TicketService {
    createTicket = async (data) => {
    try {
        return await ticketModel.create(data);  // ⭐ return thực sự
    } catch (error) {
        console.error("CREATE TICKET ERROR:", error);
        throw error;
    }
}

//lấy thông tin ticket
async getTicketFullInfo(ticketId) {
    return ticketModel.findById(ticketId)
        .populate({
            path: 'flight_id',
            populate: [
                { path: 'airline_id' },
                { path: 'departure_airport_id' },
                { path: 'arrival_airport_id' }
            ]
        })
        .populate('airline_id');
}

async getTicketById(id) {
    try {
        return await ticketModel
            .findById(id)
            .populate("user_id")
            .populate("airline_id")
            .populate({
                path: "flight_id",
                populate: [
                    { path: "departure_airport_id" },
                    { path: "arrival_airport_id" },
                    { path: "airline_id" }
                ]
            })
            .lean();
    } catch (error) {
        throw error;
    }
}


    getAllTickets = () => {
        return ticketModel.find({}).populate('airline_id').populate('user_id').populate({
            path: 'flight_id',
            populate: {path: 'departure_airport_id'}
        }).populate({
            path: 'flight_id',
            populate: {path: 'arrival_airport_id'}
        })
        .then((tickets) => {
            return multipleMongooseToObject(tickets);
        })
        .catch((error) => {
            throw error;
        });
    }

    deleteTicket = async (id) => {
        try {
            ticketModel.findByIdAndDelete(id).exec()
        } catch (error) {
            throw error
        }
    }

    getTicketByUser = async (user_id) => {
        try {
            return ticketModel.find({user_id: user_id}).populate('airline_id').populate('user_id').populate({
                path: 'flight_id',
                populate: {path: 'departure_airport_id'}
            }).populate({
                path: 'flight_id',
                populate: {path: 'arrival_airport_id'}
            })
        } catch (error) {
            throw error
        }
    }

    updateStatus(ticketId, status) {
        return ticketModel.findByIdAndUpdate(
            ticketId,
            { status },
            { new: true }
        );
    }

    async savePayment(ticketId, passengerInfo) {
        return ticketModel.findByIdAndUpdate(
            ticketId,
            {
                status: "pending", // user tick là pending, admin mới chuyển sang paid
                passenger_info: passengerInfo,
                payment_time: new Date()
            },
            { new: true }
        );
    }

}

module.exports = new TicketService;