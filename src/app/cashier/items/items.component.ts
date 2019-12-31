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
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  allItems:any;
  userToken: any;
  currentUser: User
  public todoList:Array<any>;
  public newTodoText:string = '';

  // items functionality
  allMyAssignedREquest: any;
  

  public displayedColumns = ['number','Category', 'Name',
  'Quantity', 'Price','details']

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

// check out
getDetails(item_id, category_id, quantity_from,item_price, name, category, description, createdBy, created_date,discount_yn){
  // console.log('selected',{item_id, category_id, quantity_from,item_price, name, category});
  this.dialog.open(DetailsModal, {
    data: {
     category_id: category_id,
     item_id: item_id,
     quantity_from: quantity_from,     
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