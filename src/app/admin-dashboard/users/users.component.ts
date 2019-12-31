import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserToken, User } from 'src/app/_model/user';
import { LoginService, AlertService, ItemsService } from 'src/app/_service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { NewUser, ResetPassWord } from 'src/app/_model/addUser.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';
import { Subscription} from 'rxjs';


export interface AllUser {
        id: Number;
        email:String;
        username: String;        
        role: String
        created_by: String
        date_created: Date
        date_updated: Date;

}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  userSubscription: Subscription;
  userToken: UserToken = new UserToken;
  allUsers: any;
  interval: any;
  userToDelete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete()


  public displayedColumns = ['number', 'UserId', 'Email', 'Username',
    'Role', 'Date Added', 'reset','Delete']

  public dataSource = new MatTableDataSource<AllUser>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private loginServices: LoginService,
    public dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getUsers();    
    this.dataSource.paginator = this.paginator
  }

  getUsers() {
   this.userSubscription= this.loginServices.getUsers(this.userToken)
      .subscribe((response) => {
        this.allUsers = response;
        this.dataSource.data = this.allUsers as AllUser[];
      },
        error => {
          this.alertService.error(error.error.message, false);
          console.log(error);
        })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  addNew(){
    this.dialog.open(NewUserModal) 
  }

  resetPassword(id, username){
    this.dialog.open(ResetUserModal,{
      data:{
        id: id,
        username: username
      }
    }) 
  }


  deleteNow(id, name){
    this.dialog.open(DeleteUserModal,{
      data:{
        id:id,
        name:name
      }, width:'40%'
    })
  }
  ngonDestroy(){
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

}

// child component for Deleting category modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'delete-user-modal',
  templateUrl: 'delete-user.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class DeleteUserModal { 
  loading = false; 
  currentToken: any; 
  currentUser: User; 
  userTodelete: ItemAndCategoryToDelete = new ItemAndCategoryToDelete();

  constructor(
    public dialogRef: MatDialogRef<DeleteUserModal>,
    private alertService: AlertService,
    private router: Router,
    private loginServices: LoginService,
         
    @Inject(MAT_DIALOG_DATA) public data: any) {      
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteNow(){
    this.loading= true;
    if(this.data.name = this.currentUser.username){
        this.alertService.error('Sorry You can not delete Yourself when already loggedIn', false);
        this.loading = false;
    }   
    else{
      this.userTodelete.id = this.data.id;
    this.userTodelete.token = this.currentToken;
    // alert(`You are about to delete ${name}.Be informed that All Items on this category will be deleted as well. Press Ok`);
    this.loginServices.deleteUser(this.userTodelete)
    .subscribe(()=>{
      this.loading = false;
      this.alertService.success(`You have succesfully deleted: ${this.data.name}`);
      this.onNoClick();
      this.router.navigate(['/admin/users']);
    }, error=>{
      this.loading = false
      this.alertService.error(`${error.error.message} when deleting ${this.data.name}`);
    })
    }
  }
 
}



// child component for adding User modal
@Component({  
  selector: 'new-user-modal',
  templateUrl: 'new-user.modal.component.html',
})

export class NewUserModal {
  newUserModel: NewUser = new NewUser()
  loading = false;  
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<NewUserModal>,
    private alertService: AlertService,
    private registerService: LoginService,
    private router: Router,         
    @Inject(MAT_DIALOG_DATA) public data: any) {     
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));     
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNewUser(){
    this.loading = true;
    if(this.newUserModel.cpassword !== this.newUserModel.password){
      this.alertService.error('passwords dont match');
      this.loading = false;
    }
    this.newUserModel.token = this.currentToken;
    // console.log('newUser', this.newUserModel);
    this.registerService.addNewUser(this.newUserModel)
    .subscribe((response)=>{
      this.alertService.success('User Succesfully added');
      this.loading = false;
      this.onNoClick();
    },error =>{
      this.alertService.error(error.error.message, false);
      this.loading = false;
      console.log(error);
    });
  }
  
}


// child component for resetting User modal
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'reset-user-modal',
  templateUrl: 'reset-user.modal.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class ResetUserModal {
  resetUserModel: ResetPassWord = new ResetPassWord()
  loading = false;  
  currentToken: any;

  constructor(
    public dialogRef: MatDialogRef<ResetUserModal>,
    private alertService: AlertService,
    private registerService: LoginService,
    private router: Router,         
    @Inject(MAT_DIALOG_DATA) public data: any) {     
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));     
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetNow(){
    this.loading = true;   
    if(this.resetUserModel.cpassword !== this.resetUserModel.password){
      this.alertService.error('passwords dont match');
      this.loading = false;
    } 
    this.resetUserModel.token = this.currentToken;
    this.resetUserModel.id = this.data.id;
    // console.log('newUser', this.resetUserModel);
    this.registerService.resetPassword(this.resetUserModel)
    .subscribe((response)=>{
      this.alertService.success('Password Reset Succesfull');
      this.loading = false;
      this.onNoClick();
    },error =>{
      this.alertService.error(error.error.message, false);
      this.loading = false;
      console.log(error);
    });
  }
  
}