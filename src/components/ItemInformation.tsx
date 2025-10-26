import {useParams} from "react-router-dom";
import {getItemInformation} from "../models/firebase-actions";
import {useEffect, useState} from "react";
import {serverTimestamp} from "firebase/firestore";

export const ItemInformation = () => {
    const {itemId} = useParams();
    const [imageDownloadUrl, setImageDownloadUrl] = useState<string | null>(null);
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
            // console.log("Item details state:", itemDetails.name);
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
                        <p>Added Date: {new Date(itemDetails.createdDate.seconds * 1000 + itemDetails.createdDate.nanoseconds/1000000).toDateString()}</p>
                        <p>Should consume before date: {new Date(itemDetails.expireDate.seconds * 1000 + itemDetails.expireDate.nanoseconds/1000000).toDateString()}</p>
                        <p>Storage Location: {itemDetails.storageLocation}</p>
                        <p>Days left: {Math.ceil((new Date((itemDetails.expireDate.seconds*1000)).getTime() - Date.now())/(1000*60*60*24))} days</p>
                        <p>Food State: {itemDetails.foodState}</p>
                        {/*// TODO: calculate urgent state based on days left and food state, food type, storage location*/}
                        <p>Urgent state: </p>
                    </>
                    )}
            </div>
            {imageDownloadUrl && <img height={200} width={250} src={ imageDownloadUrl }/>}
        </div>
    )
}