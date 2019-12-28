import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ItemsService } from '../_service';
import { UserToken, User } from '../_model/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-item-balance',
  templateUrl: './item-balance.component.html',
  styleUrls: ['./item-balance.component.css']
})
export class ItemBalanceComponent implements OnInit {

  totaNumber: any;
  userToken: UserToken = new UserToken();
  currentUser: User;
  incomingItems: any;
  available = 'yes';

  constructor(
    private itemService: ItemsService,   public dialog: MatDialog, 
  ) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
   }
 
  ngOnInit() {
    this.itemService.getItemBalanceAlert(this.userToken)
    .subscribe((response)=>{
      this.available = 'yes';
      this.incomingItems = response
      this.totaNumber = this.incomingItems.length;
    },error=>{
      this.available = 'no';
      console.log(error)});
  }
  
  viewMore(){
    this.dialog.open(MoreItemModal,{  width: '70%'})  
  }

}

// child component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'more-details-modal',
  templateUrl: 'more-details.modal.component.html',
  styleUrls: ['./item-balance.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class MoreItemModal {  
  incomingItems: any;
  currentUser: User;
  userToken: UserToken = new UserToken();


  public displayedColumns = ['number', 'Name','Description','Buying_Price', 'Selling_Price','Quantity']

public dataSource = new MatTableDataSource<AllItems>();
  

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MoreItemModal>,    
    private itemService: ItemsService,     
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }
  ngOnInit() {
    this.itemService.getItemBalanceAlert(this.userToken)
    .subscribe((response)=>{     
      this.incomingItems = response 
      this.dataSource.data = this.incomingItems as AllItems[];     
    },error=>{      
      console.log(error)});
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export interface AllItems {
  id: Number
  category_id:Number  
  name: string
  quantity: Number
  buying_price: Number;
  price: Number
  description: String
}

