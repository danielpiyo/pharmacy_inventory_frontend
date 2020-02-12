import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService } from 'src/app/_service';
import { TocheckIn, AmountToAdd } from 'src/app/_model/checkIn';


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
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  allItems: any;
  userToken: any;
  currentUser: User;
  public todoList: Array<any>;
  public newTodoText = '';

  // items functionality
  allMyAssignedREquest: any;

  public displayedColumns = ['number', 'Category', 'Name',
  'Quantity', 'Price', 'details'];

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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

// get Items
getAllItems() {
  // console.log(this.userToken);
  this.itemService.getAllItemsIn({token: this.userToken})
  .subscribe((response) => {
    this.allItems = response;
    this.dataSource.data = this.allItems as AllItems[];

    }, error => {
      this.alertService.error(error.error.message, false);
      console.log(error);
    });
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// check out
// tslint:disable-next-line: variable-name
getDetails(item_id, category_id, quantity_from, item_buying_price, item_price,
           // tslint:disable-next-line: variable-name
           name, category, description, createdBy, created_date, discount_yn, suplier, controlled_status, expire_date) {
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  // tslint:disable-next-line: no-use-before-declare
  this.dialog.open(DetailsModal, {
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
      controlled_status,
      expire_date
     }
  });
}


}


// child component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'details-modal',
  templateUrl: 'details.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class DetailsModal {


  constructor(
    public dialogRef: MatDialogRef<DetailsModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
