import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/_service/categories.service';
import { UserToken } from 'src/app/_model/user';
import { ItemCategory } from 'src/app/_model/item.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  usertoken: UserToken = new UserToken()
  itemModel: ItemCategory = new ItemCategory();
  allCategories: any;
  allItems: any;
  view='not-viewed';

  constructor(private coategoriesService: CategoriesService) { 
    this.usertoken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllCategories(); 
  }

  getAllCategories(){
    this.coategoriesService.getAllCategories(this.usertoken)
    .subscribe((response)=>{
      this.allCategories = response
    })
  }

  getItem(id){
    this.itemModel.category_id = id;
    this.itemModel.token = this.usertoken.token;
    this.coategoriesService.getItems(this.itemModel)
    .subscribe((response)=>{
      this.allItems = response
      // this.view ='viewed';
    },
    error =>{
      console.log(error);
    })
  }
  close(){
    this.view='not-viewed';
  }
}
