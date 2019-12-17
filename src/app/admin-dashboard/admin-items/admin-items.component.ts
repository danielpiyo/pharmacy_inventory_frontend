import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService, CategoriesService } from 'src/app/_service';
import { TocheckIn, AmountToAdd } from 'src/app/_model/checkIn';
import { NewItem, EditItem } from 'src/app/_model/itemNew.model';


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

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Price','details', 'edit', 'delete']

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
        }, 10000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

// get Items
getAllItems(){  
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
getDetails(item_id, category_id, quantity_from,item_price, name, category, description, createdBy, created_date){
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.dialog.open(AdminDetailsModal, {
    data: {
     category_id: category_id,
     item_id: item_id,
     quantity_from: quantity_from,     
     item_price:item_price,
     name: name,
     category: category,
     description: description,
     createdBy:createdBy,
     created_date: created_date
    }
  });
}

addNew(){
  this.dialog.open(NewItemModal)
}

editNow(id, category_id, quantity, price, category, name, description){
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
     description_to: description
   
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

  submitCheckIn(){
    this.dataToCheckIn.category_id = this.data.category_id;
    this.dataToCheckIn.item_id = this.data.item_id;
    this.dataToCheckIn.item_price = this.data.item_price;
    this.dataToCheckIn.quantity_from = this.data.quantity_from;
    this.dataToCheckIn.quantity_to = this.data.quantity_from + this.checkInModel.toadd;
    this.dataToCheckIn.token = this.currentToken;
    // console.log('data ato checkin', this.dataToCheckIn);
    this.itemService.checkInItem(this.dataToCheckIn)
    .subscribe((response)=>{
      // console.log('responseCheckin', response);
      this.alertService.success(`You have Succesfully CheckedIn additional  ${this.checkInModel.toadd} item for ${this.data.name}`);
      this.onNoClick();
      this.router.navigate(['/cashier/checkin']);
    },
    error=>{
      console.log(error);
      this.alertService.error(error.error.message);
    })
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
  // console.log('NewItem', this.newItemModel);
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
    this.editItemModel.category_id_from = this.data.category_id;
    this.editItemModel.description_from = this.data.description_from;
    this.editItemModel.description_to = this.data.description_to;
    this.editItemModel.item_name_from = this.data.item_name_from;
    this.editItemModel.item_name_to = this.data.item_name_to;
    this.editItemModel.quantity_from = this.data.quantity_from;
    this.editItemModel.quantity_to = this.data.quantity_to
    this.editItemModel.item_id = this.data.item_id;
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
