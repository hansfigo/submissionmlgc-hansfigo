import tf from "@tensorflow/tfjs-node";

async function predictImage(model, image) {
    try {
        let processedBuffer = image.buffer;

        const tensor = tf.node
            .decodeJpeg(processedBuffer)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const resultScore = Math.max(...score) * 100;
        const result = resultScore > 50 ? "Cancer" : "Non-cancer";

        const suggestion =
            result === "Cancer"
                ? "Segera periksa ke dokter!"
                : "Penyakit kanker tidak terdeteksi.";

        return { resultScore, result, suggestion };
    } catch (error) {
        console.log(error, "INI ERROR");
        throw new Error(`Failed to predict image : ${error}`);
    }
}

export default predictImage;
