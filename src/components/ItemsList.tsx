import {useEffect, useState} from "react";
import {getAllItems} from "../models/firebase-actions";
import {ItemListObject} from "./ItemListObject";

export const ItemsList = () => {
    const [items, setItems] = useState<string[]>([]);
    useEffect(() => {
        const fetchItems = async () => {
            const allItems = await getAllItems();
            if (allItems) {
                setItems(allItems);
            }
            return allItems;
        }
        fetchItems();
    }, []);
    const item_rows = () => items.map((item) => <ItemListObject key={JSON.stringify(item)} itemJSON={JSON.stringify(item)}/>);
    return (
        <>
            <div>
                <h2>Items List</h2>
            </div>
            {item_rows()}
        </>
    );
}