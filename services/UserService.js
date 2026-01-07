const User = require('../models/User');
const userVerificationService = require('./UserVerificationService');
const {multipleMongooseToObject} = require('../util/mongoose');
const {mongooseToObject} = require('../util/mongoose');
class UserService{
    getAllUser(){
        return User.find({})
            .then((users) => {
                return multipleMongooseToObject(users);
            })
            .catch((error) => {
                throw error;
            });
    }
    getUserByEmail(email){
        return User.findOne({email})
          .then((user) => {
                return mongooseToObject(user);
            })
          .catch((error) => {
                throw error;
            });
    }
    async getUserById(id){
        return User.findById(id)
           .then((user) => {
                return mongooseToObject(user);
            })
           .catch((error) => {
                throw error;
            });
    }
    async createUser(email, last_name, first_name, password, phonenumber, address, dob, res) {
        const newUser = new User({ email, last_name, first_name, password, phonenumber, address, dob, verified: false });
      
        return newUser.save()
          .then((result) => {
            //success => sending mail
            userVerificationService.sendVerificationEmail(result, res)
          })
          .catch((err) => {
            console.error('Lỗi khi lưu người dùng:', err);
            throw err;
          });
    }
    async createUserGG(newUser){
        const newUser1 = new User(newUser);
        return newUser1.save()
         .then((result) => {
            return mongooseToObject(result);
          })
         .catch((err) => {
            console.error('Lỗi khi lưu người dùng:', err);
            throw err;
          });
    }
    async updateUserStatus(userID){
        return await User.findByIdAndUpdate(userID, { verified: true }, { new: true })
        .then((user)=>{
            return mongooseToObject(user);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    async updateUserPassword(userID, password){
        return await User.findByIdAndUpdate(userID, { password }, { new: true })
        .then((user)=>{
            return mongooseToObject(user);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
      
}

module.exports = new UserService;