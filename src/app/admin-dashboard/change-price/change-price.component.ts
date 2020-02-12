import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AlertService, ItemsService } from 'src/app/_service';
import { AdminDetailsModal } from '../admin-items/admin-items.component';
import { PriceChange } from 'src/app/_model/itemNew.model';
import {Subscription } from 'rxjs';


export interface AllItems {
  id: Number;
  category_id: Number;
  category: String;
  name: string;
  quantity: Number;
  price: Number;
  description: String;
  createdBy: String;
  created_date: Date;
  buying_price: Number;
  suplier: string;
  controlled_status: string;

}


@Component({
  selector: 'app-change-price',
  templateUrl: './change-price.component.html',
  styleUrls: ['./change-price.component.css']
})
export class ChangePriceComponent implements OnInit {

  itemSubscription: Subscription;
  interval: any;
  allItems: any;
  userToken: any;
  currentUser: User;


  public displayedColumns = ['number', 'Name', 'controlled', 'Buying', 'Price', 'Quantity', 'details', 'edit'];

public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private router: Router,
    public dialog: MatDialog,
    public itemService: ItemsService,
    private alertService: AlertService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getAllItems();
    this.interval = setInterval(() => {
      this.getAllItems();
        }, 20000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

// get Items
getAllItems() {
  this.itemSubscription = this.itemService.getAllItemsIn({token: this.userToken})
  .subscribe((response) => {
    this.allItems = response;
    this.dataSource.data = this.allItems as AllItems[];

    },
    error => {
      this.alertService.error(error.error.message, false);
      console.log(error);
    });
}

// tslint:disable-next-line: variable-name
getDetails(item_id, category_id, quantity_from, item_buying_price, item_price, name,
           category, description, createdBy, created_date, suplier, controlled_status){
  console.log('selected',{item_id, category_id, quantity_from, item_buying_price, item_price, name,
           category, description, createdBy, created_date, suplier, controlled_status});
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
     suplier,
     controlled_status
    }
  });
}


changeNow(item_id, category_id, price, name, buying_price){
  // tslint:disable-next-line: no-use-before-declare
  this.dialog.open(ChangePriceModal, {
    data: {
      id: item_id,
      price_from: price,
      price_to: price,
      category_id,
      name,
      buying_price
    }
  });
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

ngonDestroy(){
  if (this.itemSubscription){
    this.itemSubscription.unsubscribe();
  }
}

}

// child component for changing price modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'change-price-modal',
  templateUrl: 'change-price.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class ChangePriceModal {
  loading = false;
  changePassModel: PriceChange = new PriceChange();
  currentUser: User;
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<ChangePriceModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

changePriceNow(){
  this.loading = true;
  this.changePassModel.item_id = this.data.id;
  this.changePassModel.price_from = this.data.price_from;
  this.changePassModel.price_to = this.data.price_to;
  this.changePassModel.category_id = this.data.category_id;
  this.changePassModel.token = this.currentToken;
  // console.log('PasswordModel', this.changePassModel);
  this.itemService.changePrice(this.changePassModel)
  .subscribe(() => {
    // console.log('PasswordChange', response);
    this.loading = false;
    this.alertService.success('Price Changed Succesfully');
    this.onNoClick();
  },
  error => {
    this.alertService.error(error.error.message, false);
    this.loading = false;
    console.log(error);
  });
}

}