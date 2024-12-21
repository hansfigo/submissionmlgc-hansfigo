import { Firestore } from "@google-cloud/firestore";
import "dotenv/config.js";

const googleCredential = process.env.GOOGLE_CLOUD_CREDENTIALS || "";

console.log(googleCredential);

const db = new Firestore({
    credentials: JSON.parse(googleCredential),
    databaseId: 'submissionmlgc-hansfigo',
    projectId: 'submissionmlgc-claudiohansfigo'
});

const predictionsCollection = db.collection("predictions");

async function storeData(id, data) {
    if (!id) {
        return { success: false, error: "ID is required" };
    }

    try {
        await predictionsCollection.doc(id).set(data);
        return { success: true };
    } catch (error) {
        console.error("Error in storeData:", error);
        throw new Error("PPP")
    }
}


async function getHistory() {
    try {
        const snapshot = await predictionsCollection.get();
        const histories = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                history: {
                    result: data.result,
                    createdAt: data.createdAt,
                    suggestion: data.suggestion,
                    createdAt: data.createdAt,
                    id: data.id
                }
            };
        });

        return histories;
    } catch (error) {
        console.error("Error in getHistory:", error);
        throw new Error("Error saat memuat histori");
    }
}


export { storeData, getHistory };
