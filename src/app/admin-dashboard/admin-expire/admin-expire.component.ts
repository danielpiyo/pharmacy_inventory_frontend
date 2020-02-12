import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { ItemsService } from 'src/app/_service/items.service';
import { UserToken } from 'src/app/_model/user';
import { Subscription } from 'rxjs';
import { AdminDetailsModal, AdminDeleteItemModal } from '../admin-items/admin-items.component';

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
  expire_date: Date;

}

@Component({
  selector: 'app-admin-expire',
  templateUrl: './admin-expire.component.html',
  styleUrls: ['./admin-expire.component.css']
})
export class AdminExpireComponent implements OnInit {
  userToken: UserToken = new UserToken();
  allExpiredItems: [];
  itemSubscription: Subscription;

  public displayedColumns = ['number', 'Category', 'Name', 'controlled', 'Quantity',
    'expiry', 'suplier', 'details', 'delete'];

  public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private itemService: ItemsService, private dialog: MatDialog) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getExpiredItems();
  }

  getExpiredItems() {
    this.itemSubscription = this.itemService.getExpiredItems(this.userToken)
      .subscribe((res: []) => {
        this.allExpiredItems = res;
        this.dataSource.data = this.allExpiredItems as AllItems[];
      }, error => {
        console.log(error.message);
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
  deleteNow(id, name) {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(AdminDeleteItemModal, {
      data: {
        id,
        name
      }
    });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }
}
