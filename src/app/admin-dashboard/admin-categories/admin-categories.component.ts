import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserToken, User } from 'src/app/_model/user';
import { CategoriesService, AlertService } from 'src/app/_service';
import { CategoryUpdate, NewCategory } from 'src/app/_model/category.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';

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

  interval:any;
  allCategories: any;
  userToken: UserToken = new UserToken;
  categoryTodelete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete();

  public displayedColumns = ['number', 'CategoryId', 'CategoryName', 'Description','Action']

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
    this.categoryService.getAllCategories(this.userToken)
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
    this.categoryTodelete.id = id;
    this.categoryTodelete.token = this.userToken.token;
    alert(`You are about to delete ${name}.Be informed that All Items on this category will be deleted as well. Press Ok`);
    this.categoryService.deleteCategory(this.categoryTodelete)
    .subscribe(()=>{
      this.alertService.success(`You have succesfully deleted: ${name}`)
    }, error=>{
      this.alertService.error(`${error.error.message} when deleting ${name}`);
    })
  }

  editNow(id, category_name, description){   
    this.dialog.open(CategoryModal, {
      data: {
       id: id,
       name: category_name,
       description: description 
      }
    });
  }

  addNew(){
    this.dialog.open(NewCategoryModal);
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
    },error=>{
      this.alertService.error(error.error.message);
      console.log(error);
    })
  }
}