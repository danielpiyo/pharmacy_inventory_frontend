import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Login } from '../_model/login.model';
import { environment } from 'src/environments/environment';
import { UserToken } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  logIn(logInPayload: Login){
    return this.http.post(`${environment.baseUrl}/signin`, logInPayload);    
  }
  
  logout(){
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUser');
  }

  getUsers(userModel: UserToken){
    return this.http.post(`${environment.baseUrl}/users`, userModel)
  }
}
