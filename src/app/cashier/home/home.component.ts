import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserToken } from 'src/app/_model/user';
import { Router } from '@angular/router';
import { TodoService } from 'src/app/_service/todo.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ItemsService } from 'src/app/_service/items.service';
import { AlertService } from 'src/app/_service';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name','Quantity', 'Price','CheckOut']

public dataSource = new MatTableDataSource<AllItems>();
  

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private router: Router,
    private toDoService: TodoService,
    public itemService: ItemsService,
    private alertService: AlertService
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.todoList = this.toDoService.getTodoList()
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllItems()
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    setInterval(()=>{
      this.getAllItems()
    },20000);
  }

// get Items
getAllItems(){
  // console.log(this.userToken);
  this.itemService.getAllItems({token:this.userToken})
  .subscribe((response)=>{
    this.allItems = response
    this.dataSource.data = this.allItems as AllItems[]; 
     
    }),
    error =>{
      this.alertService.error(error.error.message, false);
      console.log(error)
    }
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// check out
checkOutNow(item_id, category_id, quantity_from,item_price, name, category){
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.itemService.setDataToCheckOut(item_id, category_id, quantity_from,item_price, name, category);
  this.itemService.showOpacity = true;
  setTimeout(() => {  // timeout for smooth transition
    this.itemService.showStep1 = true;
  }, 500)
}

}
