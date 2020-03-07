import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ItemsService, AlertService } from 'src/app/_service';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AdminDetailsModal } from 'src/app/admin-dashboard/admin-items/admin-items.component';
import { Subscription } from 'rxjs';



export interface AllItems {
  id: number;
  category_id: number;
  category: string;
  name: string;
  quantity: number;
  buying_price: number;
  price: number;
  description: string;
  createdBy: string;
  created_date: Date;
  discount_yn: string;

}

@Component({
  selector: 'app-discounted-item-casheir',
  templateUrl: './discounted-item-cashier.component.html',
  styleUrls: ['./discounted-item-cashier.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class DiscountedItemComponentChashier implements OnInit {

  allDiscounted: any;
  userToken: any;
  currentUser: User;
  itemSubscription: Subscription;

  public displayedColumns = ['number', 'Category', 'Name',
  'Quantity', 'Buying_Price', 'details', 'checkout'];

public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public itemService: ItemsService, private alertService: AlertService, public dialog: MatDialog,  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllItems();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllItems() {
   this.itemSubscription =  this.itemService.getAllDiscountedItemsIn({token: this.userToken})
    .subscribe((response) => {
      this.allDiscounted = response;
      this.dataSource.data = this.allDiscounted as AllItems[];

      } ,
      error => {
        this.alertService.error(error.error.message, false);
        console.log(error);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line: max-line-length
  getDetails(item_id, category_id, quantity_from, item_buying_price, item_price, name, category, description, createdBy, created_date, discount_yn) {
    // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
    this.dialog.open(AdminDetailsModal, {
      data: {
       category_id,
       item_id,
       quantity_from,
       item_buying_price,
       item_price,
       name,
       category,
       description,
       createdBy,
       created_date,
       discount_yn
      }
    });
  }

// checkout
// tslint:disable-next-line: variable-name
checkOutNow(item_id, category_id, quantity_from, item_buying_price, name, category) {
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.itemService.setDataToCheckOutDiscount(item_id, category_id, quantity_from, name, category, item_buying_price);
  this.itemService.showOpacity = true;
  setTimeout(() => {  // timeout for smooth transition
    this.itemService.showStep1 = true;
  }, 500);
}

// tslint:disable-next-line: use-lifecycle-interface
ngOnDestroy() {
  if (this.itemSubscription) {
    this.itemSubscription.unsubscribe();
  }
}

}
