import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserToken, User } from 'src/app/_model/user';
import { CategoriesService, AlertService } from 'src/app/_service';
import { CategoryUpdate, NewCategory } from 'src/app/_model/category.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';
import {Subscription} from 'rxjs'
import { Router } from '@angular/router';

export interface AllCategories {
  id: Number;
  category_name: String;
  description: String;  

}

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  categorySubscription: Subscription;
  interval:any;
  allCategories: any;
  userToken: UserToken = new UserToken;
 

  public displayedColumns = ['number', 'CategoryId', 'CategoryName', 'Description','Edit', 'Delete']

  public dataSource = new MatTableDataSource<AllCategories>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private categoryService: CategoriesService,
    private alertService: AlertService,
    public dialog: MatDialog,  
  ) { 
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
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
   this.categorySubscription= this.categoryService.getAllCategories(this.userToken)
      .subscribe((response) => {
        this.allCategories = response;
        this.dataSource.data = this.allCategories as AllCategories[];
      },
        error => {
          console.log(error);
        })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteNow(id, name){
    this.dialog.open(DeleteCategoryModal,{
      data:{
        id:id,
        name:name
      },width:'40%'
    })
  }

  editNow(id, category_name, description){   
    this.dialog.open(CategoryModal, {
      data: {
       id: id,
       name: category_name,
       description: description 
      }, width:'30%'
    });
  }

  addNew(){
    this.dialog.open(NewCategoryModal);
  }
ngonDestroy(){
  if(this.categorySubscription){
    this.categorySubscription.unsubscribe();
  }
}

}

// child component for Deleting category modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'delete-category-modal',
  templateUrl: 'delete-category.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class DeleteCategoryModal { 
  loading = false; 
  currentToken: any;  
  categoryTodelete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete();

  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryModal>,
    private alertService: AlertService,
    private router: Router,
    private categoryService: CategoriesService,
         
    @Inject(MAT_DIALOG_DATA) public data: any) {      
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteNow(){
    this.loading= true;
    this.categoryTodelete.id = this.data.id;
    this.categoryTodelete.token = this.currentToken;
    // alert(`You are about to delete ${name}.Be informed that All Items on this category will be deleted as well. Press Ok`);
    this.categoryService.deleteCategory(this.categoryTodelete)
    .subscribe(()=>{
      this.loading = false;
      this.alertService.success(`You have succesfully deleted: ${this.data.name}`);
      this.onNoClick();
      this.router.navigate(['/admin/categories']);
    }, error=>{
      this.loading = false
      this.alertService.error(`${error.error.message} when deleting ${this.data.name}`);
    })
  }
 
}



// child component for updating category modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'category-modal',
  templateUrl: 'category.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class CategoryModal {
  categoryModel: CategoryUpdate = new CategoryUpdate()
  currentToken: any;
  currentUser: User;

  constructor(
    public dialogRef: MatDialogRef<CategoryModal>,
    private alertService: AlertService,
    private categoryService: CategoriesService,
         
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(){
    this.categoryModel.category_name = this.data.name;
    this.categoryModel.description = this.data.description;
    this.categoryModel.id = this.data.id;
    this.categoryModel.token = this.currentToken;
    // console.log('categoryEdit', this.categoryModel);
    this.categoryService.updateCategory(this.categoryModel)
    .subscribe((response)=>{
      // console.log(response);
      this.alertService.success('You have successfuly updated category');
      this.onNoClick();
    },error=>{
      this.alertService.error(error.error.message, false);
      console.log(error);
    })
  }
}


// child component for New category modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-category-modal',
  templateUrl: 'new-category.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class NewCategoryModal {
  categoryModel: NewCategory = new NewCategory()
  currentToken: any;
  currentUser: User;

  constructor(
    public dialogRef: MatDialogRef<NewCategoryModal>,
    private alertService: AlertService,
    private router: Router,
    private categoryService: CategoriesService,
         
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(){      
    this.categoryModel.token = this.currentToken;
    // console.log('categoryNew', this.categoryModel);
    this.categoryService.createNewCategory(this.categoryModel)
    .subscribe((response)=>{
      // console.log(response);
      this.alertService.success(`You have successfuly Added category ${this.categoryModel.category_name}`);
      this.onNoClick();
      this.router.navigate(['/admin/categories']);
    },error=>{
      this.alertService.error(error.error.message);
      console.log(error);
    })
  }
}