import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AlertService, ReportsService } from 'src/app/_service';
import { Router } from '@angular/router';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';
import { UserToken } from 'src/app/_model/user';
import { AllDay, AllWeek, AllMonth } from './report.model';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  interval: any;
  userToken: UserToken = new UserToken();
  allDay: AllDay[];
  allDayCheckin: any;
  allDayDiscount: AllDay[];
  totalDay: any;
  totalDayCheckIn: any;
  totalDayCheckInItems: any;
  totalDayDiscount: any;
  totalCheckOutToday: any;
  totalCheckOutTodayValue: any;
  allDiscount: any;
  allWeek: AllWeek[];
  totalWeek: any;
  allMonth: AllMonth[];
  totalMonth: any;
  public settings: Settings;
  // chart
  
  @ViewChild('resizedDiv', null) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv = 0;

  constructor(public appSettings: AppSettings, public dialog: MatDialog, private router: Router, private reportService: ReportsService) {
    this.settings = this.appSettings.settings;
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.getDailyReports();
    this.getWeeklyReports();
    this.getMonthlyReports();
    this.getDailyReportsDiscount();

  }


  ngOnInit() {
    this.interval = setInterval(() => {
      this.getDailyReports();
      this.getWeeklyReports();
      this.getMonthlyReports();
      this.getDailyReportsDiscount();
    }, 10000);
    //  
    this.getChartData();
    this.getChartsWeek();
    this.getChartsMonth();
    this.getDailyCheckinReports();
  }

// Sales calculations

// checkin
getDailyCheckinReports() {
  this.reportService.getCheckInReportsDay(this.userToken)
    .subscribe((response) => {
      this.allDayCheckin = response;
      console.log('responce', this.allDayCheckin)
      var total = 0;
      if (this.allDayCheckin != null && this.allDayCheckin.length > 0) {
        this.allDayCheckin.forEach(x => total += x.valueOfItems);
      }
      console.log(total);
      this.totalDayCheckIn = total; 
      this.totalDayCheckInItems = this.allDayCheckin.length;    
    },
      error => {
        console.log(error);
      })
}


  getDailyReports() {
    this.reportService.getCheckoutReportsDay(this.userToken)
      .subscribe((response: any[]) => {
        this.allDay = response;
        console.log('responce', this.allDay)
        var total = 0;
        if (this.allDay != null && this.allDay.length > 0) {
          this.allDay.forEach(x => total += x.amountSOld);
        }
        console.log(total);
        this.totalDay = total;        
      },
        error => {
          console.log(error);
        })
  }

  getDailyReportsDiscount() {
    this.reportService.getCheckoutReportsDayDiscount(this.userToken)
      .subscribe((response: any[]) => {
        this.allDayDiscount = response;
        console.log('responce', this.allDayDiscount)
        var total = 0;
        if (this.allDayDiscount != null && this.allDayDiscount.length > 0) {
          this.allDayDiscount.forEach(x => total += x.amountSOld);
        }
        console.log(total);
        this.allDiscount = this.allDayDiscount.length;
        this.totalDayDiscount = total;

        if(this.allDay != null && this.allDayDiscount != null){
          this.totalCheckOutToday = this.allDiscount + this.allDay.length;
          this.totalCheckOutTodayValue = this.totalDayDiscount + this.totalDay;
        }
        else if(this.allDay != null && this.allDayDiscount == null){
          this.totalCheckOutToday = this.allDay.length;
          this.totalCheckOutTodayValue = this.totalDay;
        }
        else if(this.allDay == null && this.allDayDiscount != null){
          this.totalCheckOutToday = this.allDiscount;
          this.totalCheckOutTodayValue = this.totalDayDiscount;
        }
      },
        error => {
          console.log(error);
        })
  }

  getWeeklyReports() {
    this.reportService.getCheckoutReportsWeek(this.userToken)
      .subscribe((response: AllWeek[]) => {
        this.allWeek = response;
        var total = 0;
        if (this.allWeek != null && this.allWeek.length > 0) {
          this.allWeek.forEach(x => total += x.amountSOld);
        }
        console.log(total);
        this.totalWeek = total;
      }, error => {
        console.log(error)
      })
  }

  getMonthlyReports() {
    this.reportService.getCheckoutReportsMonth(this.userToken)
      .subscribe((response: AllMonth[]) => {
        this.allMonth = response;
        var total = 0;
        if (this.allMonth != null && this.allMonth.length > 0) {
          this.allMonth.forEach(x => total += x.amountSOld);
        }
        console.log(total);
        this.totalMonth = total;
        // this.chart()
      }, error => {
        console.log(error);
      })
  }

  onSelect(event){

  }

  // Object.assign(this.multi_sales); 
// Chart
  public multi_sales: any[];
  public showLegend = true;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#800080', '#F47B00', '#008080',
             '#606060', '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#00FFFF', '#808000',
             '#800000', '#0000A0', '#0000A0']
  };
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = false;
  
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Sales';
  public showYAxisLabel = true;
  public yAxisLabel = 'Amount in Ksh';
  public autoScale = true;  
  public roundDomains = true;

  allmonthChart: any;
  allweekChart: any;
  alldayChart: any;
  getChartData() {
    this.reportService.getDailyCheckoutReportChart(this.userToken)
      .subscribe((response) => {
        this.alldayChart = response;        
      },error=>{
        console.log(error.error.detailed_message);
        this.alldayChart = [
          {name: 'No sales',
          value: 0}
        ]
      })
  }
  getChartsWeek() {
    this.reportService.getWeekCheckoutReportChart(this.userToken)
      .subscribe((response) => {
        this.allweekChart = response;
        this.Chart();
      },error=>{
        console.log(error.error.message);
        this.allweekChart = [
          {name: 'No sales',
          value: 0}
        ]
      })
  }

  getChartsMonth() {
    this.reportService.getMonthCheckoutReportChart(this.userToken)
      .subscribe((response) => {
        this.allmonthChart = response;
        console.log('month', this.allmonthChart)
        this.Chart();
      })
  }

  Chart() {
    this.multi_sales = [
      {
        name: 'To Day',
        series: this.alldayChart
      },
      {
        name: 'This Week',
        series: this.allweekChart
      },
      {
        name: 'This Month',
        series: this.allmonthChart
      }
    ]
  }

  viewCheckedIn(){
    this.dialog.open(CheckedInModel,{width:'70%'});
  }

}


// child component checkedIn
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'admin-allcheckin-modal',
  templateUrl: 'admin-allcheckin.modal.component.html',
  styleUrls: ['../admin-checkin/admin-checkin.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class CheckedInModel {
  userToken: UserToken = new UserToken();  
  allCheckedIn: any;

  public displayedColumns = ['number','Category', 'Name','InitialQuantity',
  'FinalQuantity', 'Value','CreatedBy', 'CreadtedDate']

public dataSource = new MatTableDataSource<AllItems>();
  

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<CheckedInModel>,
    private reportService: ReportsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {     
      this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getDailyCheckinReports();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 // checkin
getDailyCheckinReports() {
  this.reportService.getAllCheckInReport(this.userToken)
    .subscribe((response) => {
      this.allCheckedIn = response;
      this.dataSource.data = this.allCheckedIn as AllItems[];
      console.log('responceCheckIn', this.allCheckedIn)        
    },
      error => {
        console.log(error);
      })
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
  
}

export interface AllItems {

  id: Number
  createdBy: String
  category: String
  item: String
  initialItemsNumber: Number
  finalItemsNumber: Number
  valueOfItems: Number
  created_date: Date

}
