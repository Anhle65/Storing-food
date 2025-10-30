import {useGetAuth} from "../hooks/useGetAuth";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {deleteImage, updateItem, uploadImage} from "../models/firebase-actions";
import {useNavigate, useParams} from "react-router-dom";
import {DEFAULT_IMAGE_URL} from "../shares/defaultValue";

export const EditItem = () => {
    const navigate = useNavigate()
    const auth = useGetAuth();
    const {itemId} = useParams()
    const originalItem = localStorage.getItem('currentItem') ? JSON.parse(localStorage.getItem('currentItem') || '{}') : {}
    const [itemName, setItemName] = useState(originalItem.name);
    const [categoryId, setCategoryId] = useState(originalItem.categoryId);
    const [expireDate, setExpireDate] = useState(dayjs(originalItem.expireDate, 'DD-MM-YYYY'));
    const [imageUrl, setImageUrl] = useState<File | null>(originalItem.imageDownloadUrl);
    const [previewImage, setPreviewImage] = useState(originalItem.imageDownloadUrl);
    const [storageLocation, setStorageLocation] = useState(originalItem.storageLocation);
    const [foodState, setFoodState] = useState(originalItem.foodState);
    let updateFields: Record<string, string|number> = {}
    useEffect (() => {
        console.log("Original item:", originalItem)
    },[])
    const onImageChange = (event:any) => {
        if (event.target.files[0]) {
            const fileImage = event.target.files[0]
            setImageUrl(fileImage);
            const previewUrl = URL.createObjectURL(fileImage);
            setPreviewImage(previewUrl);
        }
    }
    const onSaveChanges = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (itemName !== originalItem.name) {
            updateFields['name'] = itemName;
        }
        if (categoryId !== originalItem.categoryId) {
            updateFields['categoryId'] = categoryId;
        }
        if (expireDate.format('DD-MM-YYYY') !== originalItem.expireDate) {
            updateFields['expireDate'] = expireDate.format('DD-MM-YYYY');
        }
        if (storageLocation !== originalItem.storageLocation) {
            updateFields['storageLocation'] = storageLocation;
        }
        if (foodState !== originalItem.foodState) {
            updateFields['foodState'] = foodState;
        }
        if (imageUrl !== originalItem.imageDownloadUrl) {
            const imageDownloadUrl = await uploadImage(imageUrl);
            updateFields['imageDownloadUrl'] = imageDownloadUrl || DEFAULT_IMAGE_URL;
            deleteImage(originalItem.imageDownloadUrl);
        }
        if(!auth.userId) {
            navigate('/');
        } else {
            updateItem(itemId, updateFields).then(()=> {
                navigate(`/item/${itemId}`)
            })
        }
    }
    return (
        <><p>Edit Item</p>
            <div>
                <form onSubmit={onSaveChanges} className="p-4">
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
                        Save changes
                    </button>
                </form>
            </div>
        </>
    )
}