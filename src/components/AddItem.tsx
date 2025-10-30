import React, {useState} from "react";
import {v4} from "uuid";
import {addItem, uploadImage} from "../models/firebase-actions";
import {useNavigate} from "react-router-dom";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';
import {useGetAuth} from "../hooks/useGetAuth";
import {Button} from "@mui/material";
import {NavBar} from "./NavBar";

export default function AddItemForm() {
    const navigator = useNavigate();
    const [itemName, setItemName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [expireDate, setExpireDate] = useState(dayjs(new Date()));
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState("");
    const [storageLocation, setStorageLocation] = useState("");
    const [foodState, setFoodState] = useState("");
    const createdDate= dayjs(new Date());
    const itemId = v4();
    const auth  = useGetAuth();
    const handleAddItem = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const imageDownloadUrl = await uploadImage(imageUrl);
            if (auth.userId !== -1) {
                await addItem(auth.userId, itemId, itemName, categoryId, createdDate.format('DD-MM-YYYY'), expireDate.format('DD-MM-YYYY'), imageDownloadUrl, storageLocation, foodState);
                console.log(imageDownloadUrl)
                navigator("/item/" + itemId);
            } else {
                console.error("Invalid user ID");
                navigator('/');
            }
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
            setPreviewImage(previewUrl);
        }
    }

    return (
        <>{auth.isAuth ? (
            <><NavBar name={auth.name} photoURL={auth.photoURL}/>
                <div rows-sm>
                    <form rows-sm onSubmit={handleAddItem} className="p-4">
                        Name:
                        <input
                            type="text"
                            placeholder="Item name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="item-input-form"/><br/>
                        Category ID:
                        <input
                            type="number"
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            className="item-input-form"/><br/>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                            <DatePicker
                                label="Expire Date:"
                                value={expireDate}
                                minDate={dayjs(new Date())}
                                onChange={(newValue: any) => {
                                    setExpireDate(newValue);
                                }}/>
                        </LocalizationProvider>
                        <br/>
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
                            onChange={(event) => {
                                onImageChange(event);
                            }}/><br/>
                        {previewImage &&
                            <img style={{height: 200, width: 250}} src={previewImage} alt="Uploaded Preview"/>}
                        <br/>
                        <button type="submit" className="item-input-form-add-button">
                            Add
                        </button>
                    </form>
                </div>
            </>
            ) : (
            <>
                <h2>Please log in to add items.</h2>
                <Button variant="contained" color="primary" onClick={() => navigator('/')}>
                    Go to Login
                </Button>
            </>)}
        </>
    );
}
