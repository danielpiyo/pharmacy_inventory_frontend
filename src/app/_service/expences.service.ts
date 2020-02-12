import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserToken } from '../_model/user';
import { environment } from 'src/environments/environment';
import { NewExpences } from '../_model/expences.model';

@Injectable({
  providedIn: 'root'
})
export class ExpencesService {

  constructor(private http: HttpClient) { }

  postExpence(expenceModel: NewExpences) {
    return this.http.post(`${environment.baseUrl}/newExpence`, expenceModel);
  }

  // getAllExpences

  getAllExpences(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/allExpences`, userToken);
  }

  // monthly Expences
  getMonthlyExpences(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/monthlyExpences`, userToken);
  }
}
