import {collection, addDoc, getDocs, query, where, orderBy} from "firebase/firestore";
import {db, storage} from "../config/firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
export async function uploadImage (imageUrl) {
    if (!imageUrl)
        return "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"; // Ensure imageUrl is valid
    try {
        const imageRef = ref(storage, `images/${imageUrl.name + v4()}`); // Use image name
        const snapshot = await uploadBytes(imageRef, imageUrl); // Upload the file
        // Get the download URL
        return getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};
export async function addItem(userId, itemId, name, categoryId, createDate, expireDate, imageDownloadUrl, storageLocation, foodState) {
    try {
        await addDoc(collection(db, "items"), {
            userId,
            itemId,
            name,
            categoryId,
            expireDate: expireDate,
            imageDownloadUrl,
            storageLocation,
            createdDate: createDate,
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

export async function getAllItems() {
    console.log("Fetching all items from Firestore");
    const collectionRef = collection(db, "items");
    const queryString = query(collectionRef, orderBy("expireDate", "asc"));
    try {
        const querySnapshot = await getDocs(queryString);
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push(doc.data());
        });
        console.log("All items:", items);
        return items;
    } catch (error) {
        console.error("Error getting all items:", error);
        return null;
    }
}