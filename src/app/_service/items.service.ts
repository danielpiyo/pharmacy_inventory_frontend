import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TocheckIn } from '../_model/checkIn';
import { NewItem, EditItem, PriceChange } from '../_model/itemNew.model';
import { UserToken } from '../_model/user';
import { ItemAndCategoryToDelete } from '../_model/item.model';
import { Mail } from '../_model/itemToMail.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  showOpacity = false;
  showStep1 = false;
  private item_id;
  private category_id;
  private quatity_from;  
  private item_price;
  private name;
  private category;

  constructor(
    private http: HttpClient
  ) { 
    
  }

  getAllItems(userToken: any) {
    return this.http.post(`${environment.baseUrl}/items`, userToken);
  }

  getAllItemsIn(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/allitems`, userToken);
  }

  getAllDiscountedItemsIn(userToken: any) {
    return this.http.post(`${environment.baseUrl}/allitemsDiscount`, userToken);
  }

  setDataToCheckOut(item_id, category_id, quantity_from, item_price, name, category) {
    this.item_id = item_id;
    this.category_id = category_id;
    this.quatity_from = quantity_from;
    this.item_price = item_price;
    this.name = name;
    this.category = category;
  }

  getDataToCheckOut() {
    let temp = {'item_id': this.item_id, 'category_id': this.category_id,
               'quantity_from': this.quatity_from, 'item_price': this.item_price,
               'name': this.name, 'category': this.category};
    this.clearDataToCheckOut();
    return temp;
  }

  // discount data


  setDataToCheckOutDiscount(item_id, category_id, quantity_from, name, category, item_price) {
    this.item_id = item_id;
    this.category_id = category_id;
    this.quatity_from = quantity_from;    
    this.name = name;
    this.category = category;
    this.item_price = item_price;
  }

  getDataToCheckOutDiscount() {
    let temp = {'item_id': this.item_id, 'category_id': this.category_id,
               'quantity_from': this.quatity_from,
               'name': this.name, 'category': this.category, 'item_buying_price': this.item_price};
    this.clearDataToCheckOut();
    return temp;
  }


  clearDataToCheckOut() {
    this.item_id = undefined;
    this.category_id = undefined;
    this.quatity_from = undefined;
    this.item_price = undefined;
    this.name = undefined;
    this.category = undefined;
  }
  
  checkInItem(toChekIn: TocheckIn) {
    return this.http.post(`${environment.baseUrl}/checkin`, toChekIn);
  }

  addNewItem(newItem: NewItem) {
    return this.http.post(`${environment.baseUrl}/newItem`, newItem);
  }

  editItem(editModel: EditItem) {
    return this.http.post(`${environment.baseUrl}/updateItem`, editModel);
  }

  changePrice(price: PriceChange) {
    return this.http.post(`${environment.baseUrl}/priceChange`, price);
  }
  getItemBalanceAlert(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/itemsTopup`, userToken);
  }

  deleteItem(itemTodelete: ItemAndCategoryToDelete) {
    return this.http.post(`${environment.baseUrl}/deleteItem`, itemTodelete);
  }
  getAdminMails(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/adminDetails`, userToken);
  }

  sendMail( mail: Mail) {
    return this.http.post(`${environment.baseUrl}/sendMail`, mail);
  }

  // getExpiredProducts
  getExpiredItems(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/ExpiredItems`, userToken);
  }
}
