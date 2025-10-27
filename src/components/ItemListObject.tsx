import {getNumberDaysLeftBeforeExpiration} from "../models/dateConverter";
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import {useNavigate} from "react-router-dom";

interface IItemProps {
    itemJSON: string|undefined
}
export const ItemListObject = (props: IItemProps) => {
    const navigator = useNavigate();
    const itemData = props.itemJSON ? JSON.parse(props.itemJSON) : null;
    const imageDownloadUrl = itemData?.imageDownloadUrl || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
    return (
        <Card sx={{ display: 'flex', maxWidth: 500, margin: '10px auto' }} onClick={() => {navigator(`/item/${itemData.itemId}`)}}>
            <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={imageDownloadUrl}
                alt={itemData.categoryId}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h6" component="div">
                        {itemData.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Days left: {getNumberDaysLeftBeforeExpiration(itemData.expireDate, itemData.createdDate)}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}