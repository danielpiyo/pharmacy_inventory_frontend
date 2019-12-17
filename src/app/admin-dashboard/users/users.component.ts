import { Component, OnInit, ViewChild } from '@angular/core';
import { UserToken } from 'src/app/_model/user';
import { LoginService } from 'src/app/_service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';


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


  public displayedColumns = ['number', 'UserId', 'Email', 'Username',
    'Role', 'Date Added']

  public dataSource = new MatTableDataSource<AllUser>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private loginServices: LoginService
  ) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getUsers();
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
  
}
