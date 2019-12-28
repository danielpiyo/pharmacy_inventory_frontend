import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService, CategoriesService } from 'src/app/_service';
import { TocheckIn, AmountToAdd } from 'src/app/_model/checkIn';
import { NewItem, EditItem } from 'src/app/_model/itemNew.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';


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
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css']
})
export class AdminItemsComponent implements OnInit {

  interval:any;
  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';
  itemTodetete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete();
  

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Buying_Price', 'Price','details', 'edit', 'delete']

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
    this.getAllItems()
    this.interval = setInterval(() => { 
      this.getAllItems(); 
        }, 20000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

// get Items
getAllItems(){  
  this.itemService.getAllItemsIn({token:this.userToken})
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

addNew(){
  this.dialog.open(NewItemModal) 
}

deleteNow(id, name){
  this.itemTodetete.id = id;
  this.itemTodetete.token = this.userToken;
  alert(`Are you sure you want to delete: ${name}?`);
  this.itemService.deleteItem(this.itemTodetete)
  .subscribe((res)=>{
    this.alertService.success(`You have succesfuly deleted: ${name}`)
  },
  error=>{
    this.alertService.error(`${error.error.message} when deleting ${name}`)
  });

}

editNow(id, category_id, quantity,buying_price, price, category, name, description,discount_yn){
  this.dialog.open(AdminEditDetailsModal, {
    data: {
     category_id: category_id,
     category_id_from: category_id,
     item_id: id,
     quantity_to: quantity,
     quantity_from:quantity,     
     price:price,
     item_name_from: name,   
     item_name_to: name,
     category: category,  
     description_from: description,
     description_to: description,
     buying_price_from: buying_price,
     buying_price_to: buying_price,
     discount_yn_before:discount_yn,
     discount_yn_after: discount_yn
   
    }
  });
}

}


// child component for opportunity modal
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

}



// child component for opportunity modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-item-modal',
  templateUrl: 'new-item.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class NewItemModal {
  loading = false;
  allCategories: any;
  newItemModel: NewItem = new NewItem()
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<NewItemModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,
    private categoryServices:CategoriesService,     
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.getCategories();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

getCategories(){
  this.categoryServices.getAllCategories({token:this.currentToken})
  .subscribe((response)=>{
    this.allCategories = response
    console.log('categories', this.allCategories)
  },error=>{
    console.log(error.error.message);
  })
}

addNewItem(){
  this.loading = true;
  this.newItemModel.token = this.currentToken;
  console.log('NewItem', this.newItemModel);
  this.itemService.addNewItem(this.newItemModel)
  .subscribe((response)=>{
    this.loading = false;
    this.alertService.success(`You have succesfuly Added Item: ${this.newItemModel.name}`,true );
    this.onNoClick();
  },error=>{
    this.loading = false;
    this.alertService.error(error.error.message);
    })
}
  
}



// child component for opportunity modal
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
  allCategories:any;
  editItemModel: EditItem = new EditItem()
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<AdminEditDetailsModal>,
    private alertService: AlertService,
    private router: Router,
    private itemService: ItemsService,  
    private categoryServices:CategoriesService,      
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.getCategories();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getCategories(){
    this.categoryServices.getAllCategories({token:this.currentToken})
    .subscribe((response)=>{
      this.allCategories = response
      // console.log('categories', this.allCategories)
    },error=>{
      console.log(error.error.message);
    })
  }

  updateItem(){
    this.loading = true;
    // if(this.editItemModel.category_id == null){
    //   this.alertService.error('Please Select the category of this Item first');
    //   this.loading = false;
    // }
    this.editItemModel = this.data;
    // this.editItemModel.category_id_from = this.data.category_id;
    // this.editItemModel.category_id = this.data.category_id;
    // this.editItemModel.description_from = this.data.description_from;
    // this.editItemModel.description_to = this.data.description_to;
    // this.editItemModel.item_name_from = this.data.item_name_from;
    // this.editItemModel.item_name_to = this.data.item_name_to;
    // this.editItemModel.quantity_from = this.data.quantity_from;
    // this.editItemModel.quantity_to = this.data.quantity_to
    // this.editItemModel.item_id = this.data.item_id;
    // this.editItemModel.buying_price_from = this.data.buying_price_from;
    // this.editItemModel.buying_price_to = this.data.buying_price_to;
    // this.editItemModel.discount_yn_before = this.data.discount_yn_before;
    // this.editItemModel.discount_yn_after = this.data.discount_yn_after;
    this.editItemModel.token = this.currentToken;
    console.log('EditedModel', this.editItemModel);
    this.itemService.editItem(this.editItemModel)
    .subscribe((response)=>{
      this.loading = false;
      console.log(response);
      this.alertService.success(`You have succesfully updated ${this.editItemModel.item_name_from}`, true);
      this.onNoClick()
    },
    error=>{
      this.loading = false;
      console.log(error);
    })
  }
  
}
