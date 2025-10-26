import {collection, addDoc, serverTimestamp, getDocs, query, where} from "firebase/firestore";
import { db } from "../config/firebase.js";
export async function addItem(itemId, name, categoryId, expireDate, imageDownloadUrl, storageLocation, foodState) {
    try {
        await addDoc(collection(db, "items"), {
            itemId,
            name,
            categoryId,
            expireDate: new Date(expireDate),
            imageDownloadUrl,
            storageLocation,
            createdDate: serverTimestamp(),
            foodState
        });
        console.log("Item added successfully");
    } catch (error) {
        console.error("Error adding item:", error);
    }
};

export async function getItemInformation(itemId) {
    const queryResult = query(collection(db, "items"), where("itemId", "==", itemId));
    try {
        const querySnapshot = await getDocs(queryResult);
        if (!querySnapshot.empty) {
            const itemData = querySnapshot.docs[0].data();
            console.log("Item data:", itemData);
            return JSON.stringify(itemData);
        } else {
            console.log("No matching documents found");
            return null;
        }
    } catch (error) {
        console.error("Error getting item information:", error);
        return null;
    }
}
