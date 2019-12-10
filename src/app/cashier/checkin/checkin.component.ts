import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/_model/user';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AllItems } from '../home/home.component';
import { Router } from '@angular/router';
import { ItemsService, AlertService } from 'src/app/_service';

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
  

  public displayedColumns = ['number','Category', 'Name','Description',
  'Quantity', 'Price','CheckIn']

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
addOpportunity() {
  // tslint:disable-next-line: no-use-before-declare
  this.dialog.open(CheckinModal, {
    data: {
     
    }
  });
}
checkinNow(item_id, category_id, quantity_from,item_price, name, category){
  console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.addOpportunity();
}

}

// child component for opportunity modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'checkin-modal',
  templateUrl: 'checkin.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class CheckinModal {
  year: any;
  day: any;
  month: any;  
  currentUser: User;
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<CheckinModal>,
    private alertService: AlertService,
    private router: Router,   
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}