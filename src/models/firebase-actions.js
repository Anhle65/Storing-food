import {collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc} from "firebase/firestore";
import {db, storage} from "../config/firebase.js";
import {getDownloadURL, ref, uploadBytes, deleteObject} from "firebase/storage";
import {v4} from "uuid";
import {DEFAULT_IMAGE_URL} from "../shares/defaultValue";
export async function uploadImage (imageUrl) {
    if (!imageUrl)
        return DEFAULT_IMAGE_URL; // Ensure imageUrl is valid
    try {
        const imageRef = ref(storage, `images/${imageUrl.name + v4()}`); // Use image name
        const snapshot = await uploadBytes(imageRef, imageUrl); // Upload the file
        // Get the download URL
        return getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

export async function deleteImage(imageUrl) {
    if (imageUrl === DEFAULT_IMAGE_URL) return;
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
}
export async function removeItem(itemId, userId) {
    if (!itemId || !userId) return;
    try {
        console.log("Item deleted in process .........");
        const queryResult = query(collection(db, "items"), where("itemId", "==", itemId));
        const querySnapshot = await getDocs(queryResult);
        const docId = querySnapshot.docs[0].id;
        console.log("Document ID to delete:", docId);
        if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            console.log("Document ID to delete:", docId);
            await deleteDoc(doc(db, "items", docId));
            console.log("Item removed successfully");
        } else {
            console.log("No matching documents found to remove");
        }
    } catch (error) {
        console.error("Error removing item:", error);
    }
}
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

export async function getAllItems(userId) {
    console.log("Fetching all items from Firestore");
    const collectionRef = collection(db, "items");
    const queryString = query(collectionRef, where("userId", "==",userId ), orderBy("expireDate", "asc"));
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