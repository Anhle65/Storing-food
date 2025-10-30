import {useState} from "react";
import {useGetAllItems} from "../models/firebase-actions";
import {ItemListObject} from "./ItemListObject";
import {NavBar} from "./NavBar";
import {useGetAuth} from "../hooks/useGetAuth";
import AddIcon from '@mui/icons-material/Add';
import {Fab, Tooltip} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const ItemsList = () => {
    const auth = useGetAuth();
    const navigate = useNavigate();
    const [openAddMessage, setOpenAddMessage] = useState(false);
    const items = useGetAllItems();

    const item_rows = () => items.map((item) => <ItemListObject key={JSON.stringify(item)} itemJSON={JSON.stringify(item)}/>);
    return (
        <> {auth.userId !== -1 ? (
                <><NavBar name={auth.name} photoURL={auth.photoURL}/>
                    <div>
                        <h2>Items List</h2>
                    </div>
            {item_rows()}
                <Tooltip open={openAddMessage} onClose={()=>setOpenAddMessage(false)} onOpen={()=>setOpenAddMessage(true)}
                title="Add item">
                <Fab sx={{
                    position: 'fixed', // Positions the element relative to the viewport
                    bottom: 16,        // Distance from the bottom of the viewport
                    right: 16,         // Distance from the right of the viewport
                }}
                     variant="extended"
                     color="primary"
                     aria-label="add"
                     onClick={()=>navigate('/item')}>
                    <AddIcon/>Add New Item
                </Fab>
            </Tooltip></>
        ) : navigate('/')}
        </>
    );
}