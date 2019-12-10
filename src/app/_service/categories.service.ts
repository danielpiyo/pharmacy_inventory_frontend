import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserToken } from '../_model/user';
import { ItemCategory } from '../_model/item.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  constructor(private http: HttpClient) {
    
   }

  getAllCategories(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/categories`,userToken);
  }

  // items in a category
  getItems(iTemModel: ItemCategory){
    return this.http.post(`${environment.baseUrl}/itemsCategory`, iTemModel)
  }
}
