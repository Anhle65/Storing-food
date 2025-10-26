import {useParams} from "react-router-dom";
import {getItemInformation} from "../models/firebase-actions";
import {useEffect, useState} from "react";
import {convertTimestampToDateString, getNumberDaysLeftBeforeExpiration} from "../models/dateConverter";

export const ItemInformation = () => {
    const {itemId} = useParams();
    const [imageDownloadUrl, setImageDownloadUrl] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
    const [itemDetails, setItemDetails] = useState<any>(null);
    useEffect( () => {
        const getItemDetails = async () => {
            if (!itemId) return;
            const itemDetail = await getItemInformation(itemId);
            if (!itemDetail) return;
            console.log("Item detail from firebase:", JSON.parse(itemDetail));
            setImageDownloadUrl(JSON.parse(itemDetail).imageDownloadUrl);
            setItemDetails(JSON.parse(itemDetail));
            return JSON.parse(itemDetail);
        }
        getItemDetails();
    }, [itemId]);
    return (
        <div>
            Item Information Component
            <div>
                {itemDetails && (
                    // TODO: construct visual calendar to show the time tracking
                    <>
                        <p>Item: {itemDetails.name}</p>
                        <p>Category ID: {itemDetails.categoryId}</p>
                        <p>Added Date: {convertTimestampToDateString(itemDetails.createdDate)}</p>
                        <p>Should be consumed before date: {convertTimestampToDateString(itemDetails.expireDate)}</p>
                        <p>Storage Location: {itemDetails.storageLocation}</p>
                        <p>Days left: {getNumberDaysLeftBeforeExpiration(itemDetails.expireDate)} days</p>
                        <p>Food State: {itemDetails.foodState}</p>
                        {/*// TODO: calculate urgent state based on days left and food state, food type, storage location*/}
                        <p>Urgent state: </p>
                    </>
                    )}
            </div>
            <img height={200} width={250} src={ imageDownloadUrl }/>
        </div>
    )
}