const userService = require('../services/UserService');

class UserController{
    getAllUser(req, res, next) {
        userService.getAllUser()
            .then((users) => {
                res.status(200).json({ message: "ok", data: users });//api
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            });
    }
    getUserById(req,res, next) {
        const id = req.params.id;
        userService.getUserById(id)
        .then((user) => {
            res.status(200).json({ message: "ok", data: user });//api
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
    }

    
}


module.exports = new UserController;