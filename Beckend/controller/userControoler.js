const userModel = require("../model/userModel")


module.exports = {
    userCreate: async (req, res) => {
        try {
            const bodyData = req.body;
            
            const createdUsers = await Promise.all(bodyData.map(async (data) => {
                return await userModel.create(data);
            }));

            return res.status(200).send({
                data: createdUsers,
                msg: "Users created successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                msg: "Internal server error",
                success: false,
            });
        }
    },

    // Find all users
    userFindAll: async (req, res) => {
        try {
            const users = await userModel.find();
            return res.status(200).send({
                data: users,
                msg: "Users fetched successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                msg: "Internal server error",
                success: false,
            });
        }
    },

    // Find user by ID
    userFindById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).send({
                    msg: "User not found",
                    success: false,
                });
            }

            return res.status(200).send({
                data: user,
                msg: "User fetched successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                msg: "Internal server error",
                success: false,
            });
        }
    },

    // Delete user by ID
    userDelete: async (req, res) => {
        try {
            const userId = req.params.id;
            const deletedUser = await userModel.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).send({
                    msg: "User not found",
                    success: false,
                });
            }

            return res.status(200).send({
                data: deletedUser,
                msg: "User deleted successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                msg: "Internal server error",
                success: false,
            });
        }
    },

    userUpdate: async (req, res) => {
        try {
            const userId = req.params.id;

            const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, { new: true });

            if (!updatedUser) {
                return res.status(404).send({
                    msg: "User not found",
                    success: false,
                });
            }

            return res.status(200).send({
                data: updatedUser,
                msg: "User updated successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                msg: "Internal server error",
                success: false,
            });
        }
    }
}