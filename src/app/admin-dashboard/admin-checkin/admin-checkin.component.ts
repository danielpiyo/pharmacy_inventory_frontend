import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItemsService, AlertService } from 'src/app/_service';
import { TocheckIn, AmountToAdd } from 'src/app/_model/checkIn';

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
  selector: 'app-admin-checkin',
  templateUrl: './admin-checkin.component.html',
  styleUrls: ['./admin-checkin.component.css']
})
export class AdminCheckinComponent implements OnInit {

  interval:any;
  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Price','CheckIn', 'CheckOut']

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

// check in

checkinNow(item_id, category_id, quantity_from,item_price, name, category){
  console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});  
  this.dialog.open(AdminCheckinModal, {
    data: {
     category_id: category_id,
     item_id: item_id,
     quantity_from: quantity_from,     
     item_price:item_price,
     name: name
    }
  });
}

// checkout
checkOutNow(item_id, category_id, quantity_from,item_price, name, category){
  console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.itemService.setDataToCheckOut(item_id, category_id, quantity_from,item_price, name, category);
  this.itemService.showOpacity = true;
  setTimeout(() => {  // timeout for smooth transition
    this.itemService.showStep1 = true;
  }, 500)
}

}

// child component for opportunity modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'admin-checkin-modal',
  templateUrl: 'admin-checkin.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AdminCheckinModal {
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<AdminCheckinModal>,
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
    console.log('data ato checkin', this.dataToCheckIn);
    this.itemService.checkInItem(this.dataToCheckIn)
    .subscribe((response)=>{
      console.log('responseCheckin', response);
      this.alertService.success(`You have Succesfully CheckedIn additional  ${this.checkInModel.toadd} item for ${this.data.name}`);
      this.onNoClick();
      this.router.navigate(['/admin/checkin']);      
    },
    error=>{
      console.log(error);
      this.alertService.error(error.error.message);
    })
  }
  
}
