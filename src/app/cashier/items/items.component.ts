import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService } from 'src/app/_service';


export interface AllItems {
  id: Number
  category_id:Number
  category: String
  name: string
  quantity: Number
  price: Number,
  description: String
  createdBy: String
  created_date: Date
  
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Price','details']

public dataSource = new MatTableDataSource<AllItems>();
  

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private router: Router,    
    public itemService: ItemsService,
    private alertService: AlertService
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllItems()
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

// get Items
getAllItems(){
  console.log(this.userToken);
  this.itemService.getAllItems({token:this.userToken})
  .subscribe((response)=>{
    this.allItems = response
    this.dataSource.data = this.allItems as AllItems[]; 
     
    }),
    error =>{
      this.alertService.error(error, true)
      console.log(error)
    }
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// check out
getDetails(item_id, category_id, quantity_from,item_price, name, category){
  console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.itemService.setDataToCheckOut(item_id, category_id, quantity_from,item_price, name, category);
  this.itemService.showOpacity = true;
  setTimeout(() => {  // timeout for smooth transition
    this.itemService.showStep1 = true;
  }, 500)
}


}
