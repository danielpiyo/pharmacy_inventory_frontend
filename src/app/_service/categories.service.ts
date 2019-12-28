import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserToken } from '../_model/user';
import { ItemCategory, ItemAndCategoryToDelete } from '../_model/item.model';
import { CategoryUpdate, NewCategory } from '../_model/category.model';

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
  updateCategory(categoryModel: CategoryUpdate){
    return this.http.post(`${environment.baseUrl}/updateCategory`, categoryModel)
  }

  createNewCategory(newCategory:NewCategory){
    return this.http.post(`${environment.baseUrl}/newCategory`, newCategory)
  }
  // special product report
  getProductReportCheckOutWeek(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/userWeeklyAdminViewGeneral`,userToken);
  }
  getProductReportCheckOutMonth(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/userMonthlyAdminViewGeneral`,userToken);
  }
  deleteCategory(categoryTodelete:ItemAndCategoryToDelete){
    return this.http.post(`${environment.baseUrl}/deleteCategory`,categoryTodelete);
  }

}
