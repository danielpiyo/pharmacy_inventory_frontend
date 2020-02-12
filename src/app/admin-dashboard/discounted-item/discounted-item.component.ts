import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ItemsService, AlertService } from 'src/app/_service';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AdminDetailsModal, AdminEditDetailsModal } from '../admin-items/admin-items.component';
import {Subscription } from 'rxjs';


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
  contolled_status: string;
  suplier: string;

}

@Component({
  selector: 'app-discounted-item',
  templateUrl: './discounted-item.component.html',
  styleUrls: ['./discounted-item.component.css']
})
export class DiscountedItemComponent implements OnInit {

  itemSubscription: Subscription;
  allDiscounted: any;
  userToken: any;
  currentUser: User;

  public displayedColumns = ['number', 'Category', 'Name', 'controlled',
  'Quantity', 'Buying_Price', 'suplier', 'details', 'edit', 'checkout'];

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
   this.itemSubscription = this.itemService.getAllDiscountedItemsIn({token: this.userToken})
    .subscribe((response) => {
      this.allDiscounted = response;
      this.dataSource.data = this.allDiscounted as AllItems[];

      },
      error => {
        this.alertService.error(error.error.message, false);
        console.log(error);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDetails(item_id, category_id, quantity_from, item_buying_price,
              item_price, name, category, description, createdBy, created_date, discount_yn, suplier, controlled_status) {
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
       discount_yn,
       suplier,
       controlled_status
      }
    });
  }


  editNow(id, category_id, quantity, buying_price, price, category, name, description, discount_yn) {
    this.dialog.open(AdminEditDetailsModal, {
      data: {
       category_id,
       category_id_from: category_id,
       item_id: id,
       quantity_to: quantity,
       quantity_from: quantity,
       price,
       item_name_from: name,
       item_name_to: name,
       category,
       description_from: description,
       description_to: description,
       buying_price_from: buying_price,
       buying_price_to: buying_price,
       discount_yn_before: discount_yn,
       discount_yn_after: discount_yn

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
    this.itemService.showOpacity = false;
    this.itemService.showStep1 = false;
  }
}
}
