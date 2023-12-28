const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = async (req, res, next) => {
    try {

        console.log("cookie",req.cookies.token);
        console.log("body",req.body.token);
        console.log("header", req.header("Authorization"));
        const token = req.body.token || req.cookies.token ||req.header("Authorization").replace("Bearer ","");

        if (!token || token==undefined) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            });
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong veryfing the token",
        });

    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is procted route for student",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        });

    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is procted route for admin",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        });

    }
}
