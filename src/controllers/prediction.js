import { createResponse } from "../helpers/response.js";
import { getHistory, storeData } from "../services/firestore.service.js";
import predictImage from "../services/prediction.service.js";
import crypto from "crypto";


const predictionController = {
    getPredictions: async (req, res) => {
        const image = req.file;

        if (!image) {
            createResponse.error({
                res,
                message: "Image is required",
            });
            return;
        }

        const model = req.model;

        if (!model) {
            createResponse.error({
                status: 500,
                res,
                message: "Model is required",
            });
            return;
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        try {
            const predictions = await predictImage(model, image);

            await storeData(id, {
                resultScore: predictions.resultScore,
                result: predictions.result,
                suggestion: predictions.suggestion,
                createdAt
            })

            createResponse.success({
                status: 201,
                res,
                message: "Model is predicted successfully",
                data: {
                    id,
                    resultScore: predictions.resultScore,
                    result: predictions.result,
                    suggestion: predictions.suggestion,
                },
            });
            return;
        } catch (error) {
            createResponse.error({
                status: 400,
                res,
                message: "Terjadi kesalahan dalam melakukan prediksi",
            });
            return;
        }
    },

    getHistory: async (req, res) => {
        try {
            const histories = await getHistory();
            console.log(histories);
            createResponse.success({
                res,
                data: histories
            });
            return;
        } catch (error) {
            console.log(error, "ERROR");
            createResponse.error({
                status: 400,
                res,
                message: "Terjadi kesalahan dalam memuat histori",
            })
        }

    }

}

export default predictionController;
