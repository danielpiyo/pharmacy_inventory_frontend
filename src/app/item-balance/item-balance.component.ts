import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ItemsService, AlertService } from '../_service';
import { UserToken, User } from '../_model/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Mail } from '../_model/itemToMail.model';

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
    private itemService: ItemsService, public dialog: MatDialog,
  ) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.itemService.getItemBalanceAlert(this.userToken)
      .subscribe((response) => {
        this.available = 'yes';
        this.incomingItems = response;
        this.totaNumber = this.incomingItems.length;
      }, error => {
        this.available = 'no';
        console.log(error);
      });

  }

  viewMore() {
    this.dialog.open(MoreItemModal, { width: '95%' });
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
  mailModel: Mail = new Mail();
  loading = false;
  selectMail = false;
  adminUser: any;
  selctedId: number;


  public displayedColumns = ['number', 'Name', 'Buying_Price',
    'Selling_Price', 'Quantity', 'checkedIn_quantity', 'Last_checkIn',
    'Discounted', 'Value_remaining', 'Total_sold', 'expected_sale', 'email'];

  public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MoreItemModal>,
    private itemService: ItemsService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.itemService.getItemBalanceAlert(this.userToken)
      .subscribe((response) => {
        this.incomingItems = response;
        console.log('response', response);
        this.dataSource.data = this.incomingItems as AllItems[];
      }, error => {
        console.log(error);
      });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getAdminMails();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // get adminMails
  getAdminMails() {
    this.itemService.getAdminMails(this.userToken)
      .subscribe((user) => {
        this.adminUser = user;
      });
  }

  checkMails(id) {
    this.selectMail = true;
    this.selctedId = id;
  }
  // mailing
  // tslint:disable-next-line: variable-name
  mailNow(id, ItemName, category, quantity, buying_price, price,
    // tslint:disable-next-line: variable-name
          checkedIn_date, valueOfItems, totalSold, checkedIn_quantity, expected_total_sale, email, username) {
    this.loading = true;
    this.selectMail = false;
    this.mailModel.category = category;
    this.mailModel.id = id;
    this.mailModel.itemName = ItemName;
    this.mailModel.token = this.userToken.token;
    this.mailModel.buying_price = buying_price;
    this.mailModel.price = price;
    this.mailModel.checkedIn_date = checkedIn_date;
    this.mailModel.checkedIn_quantity = checkedIn_quantity;
    this.mailModel.totalSold = totalSold;
    this.mailModel.valueOfItems = valueOfItems;
    this.mailModel.quantity = quantity;
    this.mailModel.expected_total_sale = expected_total_sale;
    this.mailModel.email = email;
    this.mailModel.username = username;
    this.itemService.sendMail(this.mailModel)
      .subscribe((response) => {
        this.loading = false;
        this.onNoClick();
        this.alertService.success('Mail sent Succesfully');
      },
        error => {
          this.loading = false;
          this.alertService.error('Error sending Mail');
          console.log(error);
        });
  }

}

export interface AllItems {
  id: number;
  category_id: number;
  name: string;
  quantity: number;
  buying_price: number;
  price: number;
  description: string;
  checkedIn_date: Date;
  valueOfItems: number;
  totalSold: number;
  checkedIn_quantity: number;
  expected_total_sale: number;
  mail_sent_yn: string;
}

