import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserToken } from 'src/app/_model/user';
import { LoginService, AlertService, ItemsService } from 'src/app/_service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { NewUser, ResetPassWord } from 'src/app/_model/addUser.model';
import { ItemAndCategoryToDelete } from 'src/app/_model/item.model';


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
    this.interval = setInterval(() => { 
      this.getUsers(); 
        }, 60000);
        this.dataSource.paginator = this.paginator
  }

  getUsers() {
    this.loginServices.getUsers(this.userToken)
      .subscribe((response) => {
        this.allUsers = response;
        this.dataSource.data = this.allUsers as AllUser[];
      },
        error => {
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
    this.userToDelete.id = id;
    this.userToDelete.token = this.userToken.token;
    alert(`You are about to delete ${name}. If youre sure Please press Ok`);
    this.loginServices.deleteUser(this.userToDelete)
    .subscribe(()=>{
      this.alertService.success(`You have succesfully deleted: ${name}`)
    }, error=>{
      this.alertService.error(`${error.error.message} when deleting ${name}`);
    })
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
    console.log('newUser', this.newUserModel);
    this.registerService.addNewUser(this.newUserModel)
    .subscribe((response)=>{
      this.alertService.success('User Succesfully added');
      this.loading = false;
      this.onNoClick();
    },error =>{
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
    console.log('newUser', this.resetUserModel);
    this.registerService.resetPassword(this.resetUserModel)
    .subscribe((response)=>{
      this.alertService.success('Password Reset Succesfull');
      this.loading = false;
      this.onNoClick();
    },error =>{
      this.loading = false;
      console.log(error);
    });
  }
  
}