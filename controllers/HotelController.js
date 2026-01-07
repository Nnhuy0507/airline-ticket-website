const HotelService = require('../services/HotelService');

class HotelController {
    async getHotelsByCity(req, res) {
        // Kiểm tra đăng nhập trước
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        const city = req.params.city;

        try {
            const hotels = await HotelService.getHotelsByCity(city);

            res.render('pages/client/discover', {
                pageTitle: city,
                hotels: hotels,
                user: req.user || null
            });

        } catch (err) {
            console.error("ERROR:", err);
            res.status(500).send("Lỗi tải dữ liệu");
        }
    }
}

module.exports = new HotelController();
