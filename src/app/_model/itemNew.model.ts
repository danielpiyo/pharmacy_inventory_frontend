export class NewItem{
    category_id: Number;
    name:String;
    description: String;
    price: Number;
    quantity:Number;
    token:String;
}

export class EditItem{
    category_id: Number;
    category_id_from: Number;
    item_id: Number;
    item_name_from: String;
    item_name_to: String;
    quantity_from: Number;
    quantity_to: Number;
    description_from: String;
    description_to: String;
    token: String;
}