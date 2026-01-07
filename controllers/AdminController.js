const airlineService = require("../services/AirlineService");
const airportService = require("../services/AirportService");
const adminService = require("../services/AdminService");
const flightService = require("../services/FlightService");
const userService = require('../services/UserService');
const ticketService = require('../services/TicketService');
const { mongooseToObject } = require("../util/mongoose");
const { multipleMongooseToObject } = require("../util/mongoose");

class Admin {
  async manageFlight(req, res, next) {
    try {
      const airports = await airportService.getAllAirport();
      const airlines = await airlineService.getAllAirlines();
      const flights = await flightService.getAllFlights();
      res.render("pages/admin/manage_flights", {
        layout: "admin",
        airlines: airlines,
        airports: airports,
        flights: multipleMongooseToObject(flights),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async manageUser(req, res, next) {
    const users = await userService.getAllUser()
    res.render("pages/admin/manage_user", { layout: "admin", users: users });
  }

  async manageTicket(req, res, next) {
    const tickets = await ticketService.getAllTickets()
    res.render("pages/admin/manage_ticket", { layout: "admin", tickets: tickets });
  }

  async manageAirlines(req, res, next) {
    const airlines = await airlineService.getAllAirlines();
    res.render("pages/admin/manage_airlines", {
      layout: "admin",
      airlines: airlines,
    });
  }

  async createFlight(req, res, next) {
    try {
      await adminService.createFlight(req.body);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteFlight(req, res, next) {
    try {
      await adminService.deleteFlight(req.body.id);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async getFlightData(req, res, next) {
    const flight_data = await flightService.getFlightById(req.body.id);
    res.json({
      status: 200,
      data: flight_data,
    });
  }

  async updateFlight(req, res, next) {
    try {
      await adminService.updateFlight(req.body);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async createAirline(req, res, next) {
    try {
      await adminService.createAirline(req.body);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAirline(req, res, next) {
    try {
      await adminService.deleteAirline(req.body.id);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAirlineData(req, res, next) {
    try {
      const airlines = await airlineService.getAirlineById(req.body.id);
      res.json({
        status: 200,
        data: airlines,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAirline(req, res, next) {
    try {
      await adminService.updateAirline(req.body);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(req, res, next) {
    try {
        await adminService.deleteUser(req.body.id);
        res.json({
          status: 200,
        });
      } catch (error) {
        throw error;
      }
  }

  async getUserData(req, res, next) {
    try {
        const users = await userService.getUserById(req.body.id);
        res.json({
          status: 200,
          data: users,
        });
      } catch (error) {
        throw error;
      }
  }

  async updateUser(req, res, next) {
    try {
        await adminService.updateUser(req.body);
        res.json({
          status: 200,
        });
      } catch (error) {
        throw error;
      }
  }

  async updateVerify(req, res, next) {
    try {
        await adminService.updateVerify(req.body._id);
        res.json({
          status: 200,
        });
      } catch (error) {
        throw error;
      }
  }

  async deleteTicket(req, res, next) {
    try {
      await ticketService.deleteTicket(req.body._id);
      res.json({
        status: 200,
      });
    } catch (error) {
      throw error
    }
  }

  test() {
    console.log(123);
  }
}

module.exports = new Admin();
