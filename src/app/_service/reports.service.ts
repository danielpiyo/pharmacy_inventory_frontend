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

  getCheckInReportsDay(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkInDay`, userToken);
  }

  getAllCheckInReport(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/allcheckInReport`, userToken);
  }

  getCheckoutReportsDay(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkOutDay`, userToken);
  }

  getCheckoutReportsDayDiscount(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkOutDayDiscount`, userToken);
  }


  getCheckoutReportsWeek(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userWeeklyAdminView`, userToken);
    // return this.http.post(`${environment.baseUrl}/checkOutWeek`, userToken)
  }

  getCheckoutReportsMonth(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userMonthlyAdminView`, userToken);
    // return this.http.post(`${environment.baseUrl}/checkOutMonth`, userToken)
  }
  getDailyCheckoutReportChart(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkOutDaychart`, userToken);
  }

  getWeekCheckoutReportChart(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkOutWeekChart`, userToken);
  }

  getMonthCheckoutReportChart(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/checkOutMonthChart`, userToken);
  }

  // weekly reports with date
  getWeekCheckoutReportChartDate(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/productReportCheckOutWeekly`, userToken);
  }
  // get date independatly
  getMonthCheckoutChartByDate(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/productCheckOutMonthly`, userToken);
  }

  // userperformance week
  getUserPerformanceWeek(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userPerfomanceWeek`, userToken);
  }

    // userperformance Month
    getUserPerformanceMonth(userToken: UserToken) {
      return this.http.post(`${environment.baseUrl}/userPerfomanceMonth`, userToken);
    }
  // daily user report
  getUserDailyReport(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userDaily`, userToken);
  }

  // weekly User report
  getUserWeeklyReport(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userWeekly`, userToken);
  }

  // monthly user report
  getUserMonthlyReport(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/userMonthly`, userToken);
  }

  getLogs(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/adminViewLogs`, userToken);
  }

  // sales Summary Monthly
  getSalesSummmaryMonth(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/salesSummaryMonth`, userToken);
  }

  // sales and cost for income calculation
  getCostMonthly(userToken: UserToken) {
      return this.http.post(`${environment.baseUrl}/monthlyCost`, userToken);
  }

  getSalesMonthly(userToken: UserToken) {
    return this.http.post(`${environment.baseUrl}/monthlySales`, userToken);
}
}
