import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { analytics } from '../info-cards/dashboard.data';
import { UserToken } from 'src/app/_model/user';
import { Settings } from '../admin-home/app.settings.model';
import { AppSettings } from '../admin-home/app.settings';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/_service/reports.service';
import { CategoriesService } from 'src/app/_service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface AllItems {
  item: String;
  category: String;
  total: Number;

}

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  
  interval: any;
  userPerformance: any;
  public state = 'weekly'
  panelOpenState = false;
  userToken: UserToken = new UserToken();
  public accountSummary = {
    child: '0',
    individual: '0',
    joint: '0'
  };
  public settings: Settings;
  public allProducts : any;
  public analytics: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Year';
  public showYAxisLabel = false;
  public yAxisLabel = 'Profit';
  public colorScheme = {
    domain: ['#283593', '#039BE5', '#FF5252']
  };
  public autoScale = true;
  public roundDomains = true;

  @ViewChild('resizedDiv', null) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv = 0;

  public displayedColumns = ['number', 'Category', 'Item', 'Total']

  public dataSource = new MatTableDataSource<AllItems>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 

  constructor(public appSettings: AppSettings,
     private router: Router,
     private categoryService: CategoriesService,
      private reportService: ReportsService) {
    this.settings = this.appSettings.settings;
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
   }

  ngOnInit() {
    this.getCategories()
    this.interval = setInterval(() => { 
      this.getCategories(); 
        }, 10000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.analytics = analytics; 
    // this.getChartData();
    this.getChartsWeek();   
    this.getChartsMonth();    
    this.getUserPerformance(); 
    setTimeout(() => this.dataSource.paginator = this.paginator);   
  }

  getCategories() {
    this.categoryService.getProductReportCheckOut(this.userToken)
      .subscribe((response) => {
        this.allProducts = response;
        this.dataSource.data = this.allProducts as AllItems[];
      },
        error => {
          console.log(error);
        })
  }


  onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv !== this.resizedDiv.nativeElement.clientWidth){
      this.analytics = [...analytics];
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
      
  }


  // Chart
  public multi_salesWeekly: any[];
  public multi_salesMonthly: any[];
  public showLegend1 = true;
  public gradient1 = true;
  public colorScheme1 = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#800080', '#F47B00', '#008080',
             '#606060', '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#00FFFF', '#808000',
             '#800000', '#0000A0', '#0000A0']
  };
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = false;
  
  public showXAxis1 = true;
  public showYAxis1 = true;
  public showXAxisLabel1 = true;
  public xAxisLabel1 = 'Sales';
  public showYAxisLabel1 = true;
  public yAxisLabel1 = 'Amount in Ksh';
  public autoScale1 = true;
  
  allmonthChart: any;
  allweekChart: any;
  weekChartDate: any;
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
    this.reportService.getWeekCheckoutReportChartDate(this.userToken)
      .subscribe((response) => {
        this.allweekChart = response;        
        this.ChartWeekly();
      },error=>{
        console.log(error.error.message);
        this.allweekChart = [
          {name: 'No sales',
          value: 0}
        ]
      })
  } 

  getChartsMonth() {
    this.reportService.getMonthCheckoutChartByDate(this.userToken)
      .subscribe((response) => {
        this.allmonthChart = response;
        console.log('month', this.allmonthChart)        
        this.ChartMonthly();
      })
  }

getUserPerformance(){
  this.reportService.getUserPerformance(this.userToken)
  .subscribe((response) => {
    this.userPerformance = response;       
   console.log('users',this.userPerformance)
  },error=>{
    console.log(error.error.message);
  })
}

  ChartWeekly() {
            
    this.multi_salesWeekly = [
    
      {
        name: 'weekly Products',
        series: this.allweekChart
      }
      
    ]
  }

  ChartMonthly() {
    this.multi_salesMonthly = [ 
   
      {
        name: 'Monthly Products',
        series: this.allmonthChart
      }
    ]
  }

  weeklyChart(){
    this.state='weekly'
  }

  monthlyChart(){
    this.state ='monthly'
  }
  productTable(){
    this.state ='product'
  }

// filtering
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
}
  
}
