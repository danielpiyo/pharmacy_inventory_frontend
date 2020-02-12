import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService, CategoriesService } from 'src/app/_service';
import { TocheckIn, AmountToAdd } from 'src/app/_model/checkIn';
import { NewItem, EditItem, Expirydate } from 'src/app/_model/itemNew.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';
import { Subscription} from 'rxjs';


export interface AllItems {
  id: Number;
  category_id: Number;
  category: String;
  name: string;
  quantity: Number;
  buying_price: Number;
  price: Number;
  description: String;
  createdBy: String;
  created_date: Date;
  discount_yn: String;
  contolled_status: string;
  suplier: string;

}

@Component({
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css']
})
export class AdminItemsComponent implements OnInit {

  itemsSubscription: Subscription;
  interval: any;
  allItems: any;
  userToken: any;
  currentUser: User;
  public todoList: Array<any>;
  public newTodoText = '';



  public displayedColumns = ['number', 'Category', 'Name', 'controlled', 'Quantity',
                             'Buying_Price', 'Price', 'suplier', 'details', 'edit', 'delete'];

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
 this.itemsSubscription = this.itemService.getAllItemsIn({token: this.userToken})
  .subscribe((response) => {
    this.allItems = response;
    this.dataSource.data = this.allItems as AllItems[];

    },  error => {
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
           name, category, description, createdBy, created_date, discount_yn, suplier, controlled_status, expire_date) {
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  // tslint:disable-next-line: no-use-before-declare
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
     controlled_status,
     expire_date
    }
  });
}

addNew() {
  // tslint:disable-next-line: no-use-before-declare
  this.dialog.open(NewItemModal, {width: '80%'});
}

deleteNow(id, name) {
  // tslint:disable-next-line: no-use-before-declare
  this.dialog.open(AdminDeleteItemModal, {
    data: {
      id,
      name
    }
  });
}

// tslint:disable-next-line: variable-name
editNow(id, category_id, quantity, buying_price, price, category, name, description, discount_yn) {
  // tslint:disable-next-line: no-use-before-declare
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

// tslint:disable-next-line: use-lifecycle-interface
ngOnDestroy() {
  if (this.itemsSubscription) {
    this.itemsSubscription.unsubscribe();
  }
}

}


// child component for ItemDetails modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'details-modal',
  templateUrl: 'admin-details.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AdminDetailsModal {
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<AdminDetailsModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



// child component for New Item modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-item-modal',
  templateUrl: 'new-item.modal.component.html',
  styleUrls: ['./admin-items.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class NewItemModal {
  loading = false;
  allCategories: any;
  newItemModel: NewItem = new NewItem();
  expireDateModel: Expirydate  = new Expirydate();
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;
  categorySubscription: Subscription;
  exYear: any;
  exDay: any;
  exMonth: any;

  constructor(
    public dialogRef: MatDialogRef<NewItemModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    private categoryServices: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.getCategories();
      this.newItemModel.quantity = 1;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

getCategories() {
 this.categorySubscription = this.categoryServices.getAllCategories({token: this.currentToken})
  .subscribe((response) => {
    this.allCategories = response;
    // console.log('categories', this.allCategories)
  }, error => {
    this.alertService.error(error.error.message, false);
    console.log(error);
  });
}

addNewItem() {
  this.loading = true;
  this.newItemModel.token = this.currentToken;
  this.exYear =  this.expireDateModel.expire_date.getFullYear();
  this.exDay = this.expireDateModel.expire_date.getDay();
  this.exMonth = this.expireDateModel.expire_date.getMonth();
  this.newItemModel.expire_date = this.exYear + '-' + this.exMonth + '-' + this.exDay;
  console.log('NewItem', this.newItemModel);
  this.itemService.addNewItem(this.newItemModel)
  .subscribe(() => {
    this.loading = false;
    this.alertService.success(`You have succesfuly Added Product: ${this.newItemModel.name}`, false );
    this.onNoClick();
    this.router.navigate(['/admin/items']);
  }, error => {
    console.log(error);
    this.loading = false;
    this.alertService.error(error.error.message, false);
    });
}

ngonDestroy() {
  if (this.categorySubscription) {
    this.categorySubscription.unsubscribe();
  }
}
}



// child component for Editing Item modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'edit-details-modal',
  templateUrl: 'admin-edit-details.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AdminEditDetailsModal {
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;
  allCategories: any;
  editItemModel: EditItem = new EditItem();
  loading = false;
  categorySubscription: Subscription;
  updateItemSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AdminEditDetailsModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    private categoryServices: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.getCategories();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getCategories() {
   this.categorySubscription = this.categoryServices.getAllCategories({token: this.currentToken})
    .subscribe((response) => {
      this.allCategories = response;
    }, error => {
      this.alertService.error(error.error.message, false);
      console.log(error);
    });
  }

  updateItem() {
    this.loading = true;
    this.editItemModel = this.data;
    this.editItemModel.token = this.currentToken;
    this.updateItemSubscription =  this.itemService.editItem(this.editItemModel)
    .subscribe(() => {
      this.loading = false;
      // console.log(response);
      this.alertService.success(`You have succesfully updated ${this.editItemModel.item_name_from}`, false);
      this.onNoClick();
      this.router.navigate(['/admin/items']);
    },
    error => {
      this.loading = false;
      this.alertService.error(error.error.message, false);
      console.log(error);
    });
  }

  ngonDestroy() {
    if (this.categorySubscription || this.updateItemSubscription) {
      this.categorySubscription.unsubscribe();
      this.updateItemSubscription.unsubscribe();
    }
  }

}


// child component for Deleting Item modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'delete-details-modal',
  templateUrl: 'admin-delete-details.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AdminDeleteItemModal {

  currentToken: any;
  itemTodetete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete();
  loading = false;


  constructor(
    public dialogRef: MatDialogRef<AdminDeleteItemModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    private categoryServices: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteNow() {
    this.loading = true;
    this.itemTodetete.id = this.data.id;
    this.itemTodetete.token = this.currentToken;
    this.itemService.deleteItem(this.itemTodetete)
    .subscribe((res) => {
      this.loading = false;
      this.alertService.success(`You have succesfuly deleted: ${name}`);
      this.onNoClick();
      this.router.navigate(['/admin/items']);
    },
    error => {
      this.loading = false;
      this.alertService.error(`${error.error.message} when deleting ${name}`);
    });

  }


}
