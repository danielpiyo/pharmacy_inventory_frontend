import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService, AlertService } from 'src/app/_service';
import { UserToken } from 'src/app/_model/user';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {
    userToken: UserToken = new UserToken();
    dailyReport: any;
    weeklyReport: any;
    monthlyReport: any;
    totalDay: any;
    totalWeek: any;
    totalMonth: any;
    


  public displayedColumns = ['number','Category', 'Name','InitialQuantity','FinalQuantity', 'Amount','Time']

  public dataSource = new MatTableDataSource<AllReports>();
  public dataSourceWeek = new MatTableDataSource<AllReports>();
  public dataSourceMonth = new MatTableDataSource<AllReports>();
    
  
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private reportService: ReportsService,
    private alerService: AlertService
  ) { this.userToken.token = JSON.parse(localStorage.getItem('currentToken')) }

  ngOnInit() {
    this.getDailyUserReport();
    this.getMonthlyUserReport();
    this.getWeeklyUserReport();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // this.dataSourceWeek.paginator = this.paginator;
    // this.dataSourceWeek.sort = this.sort;

    // this.dataSourceMonth.paginator = this.paginator;
    // this.dataSourceMonth.sort = this.sort;
    
  }

  getDailyUserReport(){
    this.reportService.getUserDailyReport(this.userToken)
    .subscribe((response)=>{
      this.dailyReport = response;
      this.dataSource.data = this.dailyReport as AllReports[];
      var total = 0;
      if (this.dailyReport != null && this.dailyReport.length > 0) {
        this.dailyReport.forEach(x => total += x.amountSOld);
      }
      console.log(total);
      this.totalDay = total;
    },error=>{
      console.log(error);
    })
  }

  getWeeklyUserReport(){
    this.reportService.getUserWeeklyReport(this.userToken)
    .subscribe((response)=>{
      this.weeklyReport = response;
      this.dataSourceWeek.data = this.weeklyReport as AllReports[];
      var total = 0;
      if (this.weeklyReport != null && this.weeklyReport.length > 0) {
        this.weeklyReport.forEach(x => total += x.amountSOld);
      }
      console.log(total);
      this.totalWeek = total;
    },error=>{
      console.log(error);
    })
  }

  getMonthlyUserReport(){
    this.reportService.getUserMonthlyReport(this.userToken)
    .subscribe((response)=>{
      this.monthlyReport = response;
      this.dataSourceMonth.data = this.monthlyReport as AllReports[];
      var total = 0;
      if (this.monthlyReport != null && this.monthlyReport.length > 0) {
        this.monthlyReport.forEach(x => total += x.amountSOld);
      }
      console.log(total);
      this.totalMonth = total;
    },error=>{
      console.log(error);
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSourceWeek.filter = filterValue.trim().toLowerCase();
    this.dataSourceMonth.filter = filterValue.trim().toLowerCase();
  }
}

export interface AllReports {
  id: Number
  category: String  
  item: string
  initialItemsNumber: Number
  finalItemsNumber: Number;
  amountSOld: Number
  created_date: Date
}
