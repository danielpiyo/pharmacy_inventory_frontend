import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserToken } from '../_model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  getCheckoutReportsDay(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutDay`, userToken)
  }


  getCheckoutReportsWeek(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutWeek`, userToken)
  }

  getCheckoutReportsMonth(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutMonth`, userToken)
  }
  getDailyCheckoutReportChart(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutDaychart`, userToken)
  }

  getWeekCheckoutReportChart(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutWeekChart`, userToken)
  }

  getMonthCheckoutReportChart(userToken: UserToken){
    return this.http.post(`${environment.baseUrl}/checkOutMonthChart`, userToken)
  }
  
}
