import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AllItems } from '../home/home.component';
import { Router } from '@angular/router';
import { ItemsService, AlertService } from 'src/app/_service';
import { AmountToAdd, TocheckIn } from 'src/app/_model/checkIn';

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
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name','Quantity', 'Price','CheckIn']

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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    setInterval(() => { 
      this.getAllItems(); 
        }, 20000);
  } 

// get Items
getAllItems(){
  // console.log(this.userToken);
  this.itemService.getAllItemsIn({token:this.userToken})
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

// check in

checkinNow(item_id, category_id, quantity_from,item_price, name, category){
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});  
  this.dialog.open(CheckinModal, {
    data: {
     category_id: category_id,
     item_id: item_id,
     quantity_from: quantity_from,     
     item_price:item_price,
     name: name
    }
  });
}

}

// child component 
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'checkin-modal',
  templateUrl: 'checkin.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class CheckinModal {
  dataToCheckIn: TocheckIn = new TocheckIn();
  checkInModel: AmountToAdd = new AmountToAdd();
  currentUser: User;
  currentToken: any;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CheckinModal>,
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
    this.loading = true;
    if(this.checkInModel.toadd == null){
      this.loading = false;
      this.alertService.error('The Items to checkIn can not be empty');
    }
    else if(this.checkInModel.toadd < 1){
      this.loading = false;
      this.alertService.error('The Items to checkIn can not be less than one');
    }
   else{
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
      this.alertService.error(error.error.message, false);
    })
   }
  }
  
}