import {useNavigate, useParams} from "react-router-dom";
import {getItemInformation} from "../models/firebase-actions";
import {useEffect, useState} from "react";
import {getNumberDaysLeftBeforeExpiration} from "../models/dateConverter";
import {Card, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";

export const ItemInformation = () => {
    const navigator = useNavigate();
    const {itemId} = useParams();
    const [imageDownloadUrl, setImageDownloadUrl] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
    const [itemDetails, setItemDetails] = useState<any>(null);
    useEffect( () => {
        const getItemDetails = async () => {
            if (!itemId) navigator('/items');
            const item = await getItemInformation(itemId);
            if (!item) return;
            console.log("Item detail from firebase:", JSON.parse(item));
            setImageDownloadUrl(JSON.parse(item).imageDownloadUrl);
            setItemDetails(JSON.parse(item));
            return JSON.parse(item);
        }
        getItemDetails();
    }, [itemId]);
    return (
        <>
            {itemDetails &&
        <Card elevation={3} sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {itemDetails.name}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Category ID:</Typography>
                        <Typography variant="body1">{itemDetails.categoryId}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Added On:</Typography>
                        <Typography variant="body1">{itemDetails.createdDate}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Should be consumed before:</Typography>
                        <Typography variant="body1">{itemDetails.expireDate}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Storage Location:</Typography>
                        <Typography variant="body1">{itemDetails.storageLocation}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Days Left:</Typography>
                        <Typography variant="body1">{getNumberDaysLeftBeforeExpiration(itemDetails.expireDate, itemDetails.createdDate)} days</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" color="textSecondary">Food State:</Typography>
                        <Typography variant="body1">{itemDetails.foodState}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant='subtitle2' color='error'>
                            {/* TODO: calculate and display urgent state based on days left */}
                            Urgent State: {getNumberDaysLeftBeforeExpiration(itemDetails.expireDate, itemDetails.createdDate) <= 3 ? 'URGENT' : 'Normal'}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardMedia src={imageDownloadUrl} component="img" height="400" sx={{ objectFit: 'contain', marginTop: 2 }} />
        </Card>
            }
        </>
    )
}