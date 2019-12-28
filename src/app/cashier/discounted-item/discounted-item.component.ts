import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService, AlertService } from 'src/app/_service';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AdminDetailsModal } from 'src/app/admin-dashboard/admin-items/admin-items.component';



export interface AllItems {
  id: Number
  category_id:Number
  category: String
  name: string
  quantity: Number
  buying_price: Number;
  price: Number
  description: String
  createdBy: String
  created_date: Date
  discount_yn:String
  
}

@Component({
  selector: 'app-discounted-item-casheir',
  templateUrl: './discounted-item-cashier.component.html',
  styleUrls: ['./discounted-item-cashier.component.css']
})
export class DiscountedItemComponentChashier implements OnInit {

  allDiscounted: any;
  userToken: any;
  currentUser: User

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Buying_Price', 'details','checkout']

public dataSource = new MatTableDataSource<AllItems>();
  

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public itemService: ItemsService, private alertService: AlertService,public dialog: MatDialog,  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));    
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllItems();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllItems(){  
    this.itemService.getAllDiscountedItemsIn({token:this.userToken})
    .subscribe((response)=>{
      this.allDiscounted = response
      this.dataSource.data = this.allDiscounted as AllItems[]; 
       
      }),
      error =>{
        this.alertService.error(error.error.message, false);
        console.log(error)
      }
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDetails(item_id, category_id, quantity_from, item_buying_price,item_price, name, category, description, createdBy, created_date,discount_yn){
    // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
    this.dialog.open(AdminDetailsModal, {
      data: {
       category_id: category_id,
       item_id: item_id,
       quantity_from: quantity_from,
       item_buying_price:item_buying_price,     
       item_price:item_price,
       name: name,
       category: category,
       description: description,
       createdBy:createdBy,
       created_date: created_date,
       discount_yn:discount_yn
      }
    });
  }

// checkout
checkOutNow(item_id, category_id, quantity_from,item_price, name, category){
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.itemService.setDataToCheckOutDiscount(item_id, category_id, quantity_from,name, category);
  this.itemService.showOpacity = true;
  setTimeout(() => {  // timeout for smooth transition
    this.itemService.showStep1 = true;
  }, 500)
}


}
