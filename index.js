import { configDotenv } from 'dotenv';
import Express from 'express';
import cors from 'cors'; // Import cors
import predictionController from './src/controllers/prediction.js';
import multerUpload from './src/helpers/multer.js';
import { createResponse } from './src/helpers/response.js';
import { storeData } from './src/services/firestore.service.js';
import crypto from "crypto";

configDotenv();

const app = Express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post(
    "/predict",
    async (req, res, next) => {
        try {
            await (await import('./src/middleware/model.js')).loadModelMiddleware(req, res, next);
        } catch (err) {
            return res.status(500).json({
                error: "Failed to load the model.",
            });
        }
    },
    (req, res, next) => {
        multerUpload.single("image")(req, res, (err) => {
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    createResponse.error({
                        status: 413,
                        res,
                        message: "Payload content length greater than maximum allowed: 1000000",
                    });
                    return;
                }
                return res.status(500).json({
                    error: "An error occurred while uploading the file.",
                });
            }
            next();
        });
    },
    predictionController.getPredictions
);

app.post('/test/firestore', async (req, res) => {
    const id = crypto.randomUUID();

    try {
        await storeData(id, {
            test: 'data'
        });
        return createResponse.success({
            res,
            data: "oii",
            message: "PPPP"
        });
    } catch (error) {
        console.log(error);
        createResponse.error(
            {
                res,
                message: "error : " + error
            }
        );
    }
});

app.get('/predict/histories', predictionController.getHistory);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running, on http://localhost:3000');
});
