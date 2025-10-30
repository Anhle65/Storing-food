import {useNavigate, useParams} from "react-router-dom";
import {useGetItemById} from "../models/firebase-actions";
import {deleteImage, removeItem} from "../models/firebase-actions";
import {useEffect, useState} from "react";
import {getNumberDaysLeftBeforeExpiration} from "../models/dateConverter";
import {Card, CardContent, CardMedia, Divider, Fab, Grid, Tooltip, Typography, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useGetAuth} from "../hooks/useGetAuth";
import {DEFAULT_IMAGE_URL} from "../shares/defaultValue";
import {NavBar} from "./NavBar";

export const ItemInformation = () => {
    const navigate = useNavigate();
    const {itemId} = useParams();
    const auth = useGetAuth();
    const [imageDownloadUrl, setImageDownloadUrl] = useState<string>(DEFAULT_IMAGE_URL);
    const [openEditMessage, setOpenEditMessage] = useState(false);
    const [openDeleteMessage, setOpenDeleteMessage] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const editGame = () => {
        navigate(`/item/${itemId}/edit`);
    }
    const itemDetails = useGetItemById(itemId);
    if (!itemId) {
        return <p>Invalid item ID</p>;
    }

    if (!itemDetails) {
        return <p>Loading item details...</p>;
    }

    const deleteItem = async () => {
        try {
            await removeItem(itemId, auth.userId);
            await deleteImage(imageDownloadUrl);
            console.log("Deleted");
            navigate('/items');
        } catch (err) {
            console.error("Error deleting item:", err);
            alert("Error deleting item. Please try again.");
        }
    }

    function handleDeleteDialogClose() {
        setOpenDeleteDialog(false);
    }

    return (
        <>
            {itemDetails &&
                <><NavBar name={auth.name} photoURL={auth.photoURL}/><Card elevation={3} sx={{
                    maxWidth: 600,
                    margin: '20px auto',
                    padding: 2
                }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {itemDetails.name}
                        </Typography>
                        <Divider sx={{marginBottom: 2}}/>
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
                                <Typography variant="subtitle2" color="textSecondary">Should be consumed
                                    before:</Typography>
                                <Typography variant="body1">{itemDetails.expireDate}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="textSecondary">Storage Location:</Typography>
                                <Typography variant="body1">{itemDetails.storageLocation}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="textSecondary">Days Left:</Typography>
                                <Typography
                                    variant="body1">{getNumberDaysLeftBeforeExpiration(itemDetails.expireDate, itemDetails.createdDate)} days</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="textSecondary">Food State:</Typography>
                                <Typography variant="body1">{itemDetails.foodState}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='subtitle2' color='error'>
                                    {/* TODO: calculate and display urgent state based on days left */}
                                    Urgent
                                    State: {getNumberDaysLeftBeforeExpiration(itemDetails.expireDate, itemDetails.createdDate) <= 3 ? 'URGENT' : 'Normal'}
                                </Typography>
                                <Tooltip open={openEditMessage} onClose={() => setOpenEditMessage(false)}
                                         onOpen={() => setOpenEditMessage(true)}
                                         title="Edit item">
                                    <Fab color="success" aria-label="edit" onClick={editGame}>
                                        <EditIcon/>
                                    </Fab>
                                </Tooltip>
                                <Tooltip open={openDeleteMessage} onClose={() => setOpenDeleteMessage(false)}
                                         onOpen={() => setOpenDeleteMessage(true)}
                                         title="Delete item">
                                    <Fab color="error" aria-label="delete" onClick={() => {
                                        setOpenDeleteDialog(true);
                                    }}>
                                        <DeleteIcon/>
                                    </Fab>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteDialogClose}
                        aria-labelledby="alert-dialog-title-delete"
                        aria-describedby="alert-dialog-delete">
                        <DialogTitle id="alert-dialog-title-delete">
                            {"Delete item?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-delete">
                                Are you sure you want to delete this item?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                            <Button variant="outlined" color="error" onClick={() => {
                                if (itemId)
                                    deleteItem();
                                handleDeleteDialogClose();
                            }} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <CardMedia src={imageDownloadUrl} component="img" height="400"
                               sx={{objectFit: 'contain', marginTop: 2}}/>
                </Card></>
            }
        </>
    )
}