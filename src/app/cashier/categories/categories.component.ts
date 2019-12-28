import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CategoriesService } from 'src/app/_service/categories.service';
import { UserToken } from 'src/app/_model/user';
import { ItemCategory } from 'src/app/_model/item.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'src/app/_service';


export interface AllCategories {
  id: Number;
  category_name: String;
  description: String;

}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  usertoken: UserToken = new UserToken()
  itemModel: ItemCategory = new ItemCategory();
  allCategories: any;
  allItems: any;
  view='not-viewed';
  interval: any;

  public displayedColumns = ['number','CategoryName', 'Description','Action']

  public dataSource = new MatTableDataSource<AllCategories>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(private categoryService: CategoriesService, public dialog: MatDialog, private alertService: AlertService ) { 
    this.usertoken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getCategories();  
    this.interval = setInterval(() => { 
      this.getCategories(); 
        }, 10000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getCategories() {
    this.categoryService.getAllCategories(this.usertoken)
      .subscribe((response) => {
        this.allCategories = response;
        this.dataSource.data = this.allCategories as AllCategories[];
      },
        error => {
          this.alertService.error(error.error.message, false);
          console.log(error);
        })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  viewNow(id){
    this,this.dialog.open(MoreCategoriesModal, {
      data:{
        id: id
      }, width:'70%'
    })
  }
}

// child component l
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'more-category-modal',
  templateUrl: 'more-category.modal.component.html',
  styleUrls: ['./categories.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class MoreCategoriesModal {  
  allItems: any;
  usertoken: UserToken = new UserToken()
  itemModel: ItemCategory = new ItemCategory();

  public displayedColumns = ['number','ProductName', 'Description']

  public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MoreCategoriesModal>,    
    private categoryService: CategoriesService,
         private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {     
      this.usertoken.token = JSON.parse(localStorage.getItem('currentToken'));
      this.getItem()
  }
  ngOnInit() {  ;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  getItem(){
    this.itemModel.category_id = this.data.id;
    this.itemModel.token = this.usertoken.token;
    this.categoryService.getItems(this.itemModel)
    .subscribe((response)=>{
      this.allItems = response
      this.dataSource.data = this.allItems as AllItems[];;
    },
    error =>{
      this.alertService.error(error.error.message, false);
      console.log(error);
    })
  }
  
}


export interface AllItems {
  id: Number;
  name: String;
  description: String;

}