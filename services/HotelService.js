const Hotel = require('../models/Hotel'); // REQUIRES MODEL

class HotelService {
    async getHotelsByCity(city) {
        return await Hotel.find({ city }).lean();
    }

    async createHotel(hotelData) {
        try {
            // Sử dụng Hotel Model để tạo bản ghi mới
            const newHotel = new Hotel(hotelData); 
            const savedHotel = await newHotel.save(); 
            return savedHotel;
        } catch (error) {
            console.error("Lỗi khi thêm khách sạn mới:", error);
            // Ném lỗi để Controller xử lý
            throw new Error("Không thể thêm dữ liệu khách sạn.");
        }
    }
}

module.exports = new HotelService(); // EXPORTS SERVICE INSTANCE