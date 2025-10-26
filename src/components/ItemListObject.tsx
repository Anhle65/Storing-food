import {getNumberDaysLeftBeforeExpiration} from "../models/dateConverter";

interface IItemProps {
    itemJSON: string|undefined
}
export const ItemListObject = (props: IItemProps) => {
    const itemData = props.itemJSON ? JSON.parse(props.itemJSON) : null;
    const imageDownloadUrl = itemData?.imageDownloadUrl || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
    return (
        <div className="p-4 border rounded-md mb-3 shadow-sm">
            <h3>{itemData.name}</h3>
            <p>Category: {itemData.categoryId}</p>
            <p>Days left: {getNumberDaysLeftBeforeExpiration(itemData.expireDate)}</p>
            <img
                src={imageDownloadUrl}
                alt={itemData.name}
                width={200}
                className="item-image"
            />
        </div>
    )
}