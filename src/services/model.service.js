import tf from "@tensorflow/tfjs-node";

const loadModel = async () => {
    return tf.loadGraphModel(process.env.MODEL_URL);
}

export default loadModel;

