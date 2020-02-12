import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Login } from '../_model/login.model';
import { environment } from 'src/environments/environment';
import { UserToken } from '../_model/user';
import { NewUser, ResetPassWord } from '../_model/addUser.model';
import { ItemAndCategoryToDelete } from '../_model/item.model';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient, private appService: AppService
  ) { }

  logIn(logInPayload: Login){
    return this.http.post(`${environment.baseUrl}/signin`, logInPayload);    
  }
  
  logout(){
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUser');
    this.appService.setUserLoggedIn(false);
  }

  getUsers(userModel: UserToken){
    return this.http.post(`${environment.baseUrl}/users`, userModel)
  }

  addNewUser(newUser: NewUser){
    return this.http.post(`${environment.baseUrl}/register`,newUser);
  }
  resetPassword(reset:ResetPassWord){
    return this.http.post(`${environment.baseUrl}/resetPassoword`, reset)
  }

  deleteUser(userTodelete:ItemAndCategoryToDelete){
    return this.http.post(`${environment.baseUrl}/deleteUser`, userTodelete);
  }
}
