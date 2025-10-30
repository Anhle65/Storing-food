import {collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, onSnapshot} from "firebase/firestore";
import {db, storage} from "../config/firebase.js";
import {getDownloadURL, ref, uploadBytes, deleteObject} from "firebase/storage";
import {v4} from "uuid";
import {DEFAULT_IMAGE_URL} from "../shares/defaultValue";
import {useEffect, useState} from "react";
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
}

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

export async function updateItem(itemId, updateFields) {
    if (!itemId || !updateFields) return;
    try{
        const queryResult = query(collection(db, "items"), where("itemId", "==", itemId));
        const querySnapshot = await getDocs(queryResult);
        const docId = querySnapshot.docs[0].id;
        for (const [key, value] of Object.entries(updateFields)) {
            console.log(`Updating field: ${key} with value: ${value}`);
            await updateDoc(doc(db, "items", docId), {[key]: value});
        }
    } catch (error) {
        console.error("Error updating item:", error);
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
}

export function useGetItemById(itemId) {
    const [item, setItem] = useState({
        itemId: '-1',
        name: '',
        categoryId: -1,
        expireDate: '',
        imageDownloadUrl: DEFAULT_IMAGE_URL,
        storageLocation: '',
        createdDate: '',
        foodState: ""
    });

    useEffect(() => {
        if (!itemId) {
            setItem(null);
            return;
        }

        const collectionRef = collection(db, "items");
        const q = query(collectionRef, where("itemId", "==", itemId));

        // Start listening in real time
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0]; // assume 1 item
                setItem({ id: doc.id, ...doc.data() });
            } else {
                setItem(null);
            }
        }, (error) => {
            console.error("Error getting item information:", error);
        });

        // ✅ Cleanup the listener when itemId changes or component unmounts
        return () => unsubscribe();

    }, [itemId]);

    return item;
}

export function useGetAllItems(userId) {
    const [items, setItems] = useState([]);
    const getAllItems = async () => {
        const collectionRef = collection(db, "items");
        const q = query(collectionRef, where("userId", "==",userId ), orderBy("expireDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(itemsData);
        });

        // Cleanup when component unmounts
        return () => unsubscribe();
    }

    useEffect(() => {
        getAllItems();
    }, []);

    return items;
}