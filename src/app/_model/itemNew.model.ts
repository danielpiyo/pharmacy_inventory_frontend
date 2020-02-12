export class NewItem{
    category_id: Number;
    name:String;
    description: String;
    buying_price:Number;
    price: Number;
    quantity:Number;
    token:String;
    discount_yn: String;
    contolled_status: string;
    suplier: string;
    expire_date: any;
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
    buying_price_from: Number;
    buying_price_to:Number;
    discount_yn_before: String;
    discount_yn_after:String;
}

export class PriceChange{
    item_id:Number;
    price_from: Number;
    price_to: Number;
    category_id: Number;    
    token: String;
}

export class Expirydate {
    expire_date: Date;
}