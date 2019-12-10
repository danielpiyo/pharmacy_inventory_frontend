import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  showOpacity = false;
  showStep1 = false;
  private item_id;
  private category_id;
  private quatity_from;  
  private item_price
  private name;
  private category

  constructor(
    private http: HttpClient
  ) { 
    
  }

  getAllItems(userToken:any){
    return this.http.post(`${environment.baseUrl}/items`,userToken);
  }

  setDataToCheckOut(item_id, category_id, quantity_from,item_price,name, category){
    this.item_id = item_id;
    this.category_id = category_id;
    this.quatity_from = quantity_from;
    this.item_price = item_price;
    this.name = name;
    this.category = category;
  }

  getDataToCheckOut(){
    let temp = {'item_id':this.item_id, 'category_id':this.category_id,
               'quantity_from':this.quatity_from, 'item_price':this.item_price,
               'name':this.name, 'category':this.category}
    this.clearDataToCheckOut();
    return temp;
  }

  clearDataToCheckOut(){
    this.item_id = undefined;
    this.category_id = undefined;
    this.quatity_from = undefined;
    this.item_price = undefined;
    this.name = undefined;
    this.category = undefined;
  }
  
}
