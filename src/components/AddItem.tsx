import React, {useEffect, useState} from "react";
import {db, storage} from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
export default function AddItemForm() {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [expireDate, setExpireDate] = useState("");
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [imageDownloadUrl, setImageDownloadUrl] = useState("");
    const [storageLocation, setStorageLocation] = useState("");
    const [foodState, setFoodState] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const itemId = v4();
    const handleAddItem = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "items"), {
                itemId,
                name,
                categoryId,
                expireDate,
                imageDownloadUrl,
                storageLocation,
                selectedDate,
                foodState
            });
            console.log(imageDownloadUrl)
            alert("Item added!");
            // setName("");
            // setExpireDate("");
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };
    const onImageChange = (event:any) => {
        if (event.target.files[0]) {
            setImageUrl(event.target.files[0]);
        }
    }
    const uploadImage = async () => {
        if (!imageUrl) return; // Ensure imageUrl is valid
        try {
            const imageRef = ref(storage, `images/${imageUrl.name + v4()}`); // Use image name
            const snapshot = await uploadBytes(imageRef, imageUrl); // Upload the file
            const url = await getDownloadURL(snapshot.ref); // Get the download URL
            setImageDownloadUrl(url); // Update state with the URL
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        uploadImage(); // Call uploadImage only when imageUrl changes
    }, [imageUrl]);
    return (
            <div rows-sm>
            <form rows-sm onSubmit={handleAddItem} className="p-4">
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="item-input-form"/><br/>
                <input
                    type="number"
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                    className="item-input-form"/><br/>
                <input
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="item-input-form"/><br/>
                <input
                    type="text"
                    placeholder="Storage location"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    className="item-input-form"/><br/>
                <input
                    type="text"
                    placeholder="State"
                    value={foodState}
                    onChange={(e) => setFoodState(e.target.value)}
                    className="item-input-form"/><br/>
                <input
                    type='file'
                    onChange={(event) => {onImageChange(event)}}
                /><br/>
                {imageDownloadUrl && <img style={{height:200, width:250}} src={imageDownloadUrl} alt="Uploaded Preview" />}
                <br/>
                <button type="submit" className="item-input-form-add-button">
                    Add
                </button>
            </form>
            </div>
    );
}
