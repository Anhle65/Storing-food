import React, {useEffect, useState} from "react";
import {storage} from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import {addItem} from "../models/firebase-actions";
import {useNavigate} from "react-router-dom";
export default function AddItemForm() {
    const navigator = useNavigate();
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [expireDate, setExpireDate] = useState("");
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    // const [imageDownloadUrl, setImageDownloadUrl] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [storageLocation, setStorageLocation] = useState("");
    const [foodState, setFoodState] = useState("");
    const itemId = v4();
    const handleAddItem = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const imageDownloadUrl = await uploadImage()
            await addItem(itemId, name, categoryId, expireDate, imageDownloadUrl, storageLocation, foodState);
            console.log(imageDownloadUrl)
            // alert("Item added!");
            navigator("/item/"+itemId);
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };
    const onImageChange = (event:any) => {
        if (event.target.files[0]) {
            const fileImage = event.target.files[0]
            setImageUrl(fileImage);
            // For previewing the image just right after user uploads file
            // and let the background upload happens which avoids waiting time
            const previewUrl = URL.createObjectURL(fileImage);
            console.log("========previewUrl", previewUrl);
            setPreviewImage(previewUrl);
        }
    }
    const uploadImage = async () => {
        if (!imageUrl) return; // Ensure imageUrl is valid
        try {
            const imageRef = ref(storage, `images/${imageUrl.name + v4()}`); // Use image name
            const snapshot = await uploadBytes(imageRef, imageUrl); // Upload the file
            const url = await getDownloadURL(snapshot.ref); // Get the download URL
            console.log("========", url);
            return url;
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
            <div rows-sm>
            <form rows-sm onSubmit={handleAddItem} className="p-4">
                Name:
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="item-input-form"/><br/>
                Category ID:
                <input
                    type="number"
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                    className="item-input-form"/><br/>
                Expire Date:
                <input
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="item-input-form"/><br/>
                Storage Location:
                <input
                    type="text"
                    placeholder="Storage location"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    className="item-input-form"/><br/>
                Food State:
                <input
                    type="text"
                    placeholder="State"
                    value={foodState}
                    onChange={(e) => setFoodState(e.target.value)}
                    className="item-input-form"/><br/>
                <input
                    type='file'
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={(event) => {onImageChange(event)}}
                /><br/>
                {previewImage && <img style={{height:200, width:250}} src={previewImage} alt="Uploaded Preview" />}
                <br/>
                <button type="submit" className="item-input-form-add-button">
                    Add
                </button>
            </form>
            </div>
    );
}
