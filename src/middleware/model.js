import loadModel  from "../services/model.service.js";

export const loadModelMiddleware = async (req, res, next) => {
    try {
        req.model = await loadModel();
        next();
    } catch (error) {
        console.log(error, "ERROR");
        return res.status(500).send("Failed to load model");
    }
};