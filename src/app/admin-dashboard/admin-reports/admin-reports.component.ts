import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { analytics } from '../info-cards/dashboard.data';
import { UserToken } from 'src/app/_model/user';
import { Settings } from '../admin-home/app.settings.model';
import { AppSettings } from '../admin-home/app.settings';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/_service/reports.service';
import { CategoriesService, ItemsService, AlertService } from 'src/app/_service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface AllItems {
  item: String;
  category: String;
  id: Number;
  createdBy: String;
  initialItemsNumber: Number
  finalItemsNumber: Number;
  amountSOld: Number;
  created_date: Date;
  // for extra items instore
  quantity: Number;
  purchase_cost: Number;
  worth_value: Number;
 
}

export interface AllItemsStore {
  id: Number;
  category: String;
  name:String;
  quantity: Number;
  buying_price: Number;
  price:Number;
  purchase_cost:Number;
  worth_value:Number;
  discount_yn: String;
}

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  allItems: any;
  interval: any;
  userPerformanceWeek: any;
  userPerformanceMonth: any;
  public state = 'weekly'
  panelOpenState = false;
  userToken: UserToken = new UserToken();
  public accountSummary = {
    child: '0',
    individual: '0',
    joint: '0'
  };
  public settings: Settings;
  public allProductsWeekly: any;
  public allProductsMonthly: any;
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

  public displayedColumns = ['number', 'Item', 'createdBy', 'initialItemsNumber', 'finalItemsNumber', 'created_date', 'Total']
  
  public displayedColumnsStore = ['number', 'category', 'name', 'quantity', 'buying_price', 'selling_price', 'purchase_cost','worth_value']


  public dataSource = new MatTableDataSource<AllItems>();
  public dataSourceMonth = new MatTableDataSource<AllItems>();
  public dataSourceStore = new MatTableDataSource<AllItemsStore>()


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: true }) paginatorMonth: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorStore: MatPaginator;


  constructor(public appSettings: AppSettings,
    private itemService: ItemsService,
    private alertService: AlertService,
    private categoryService: CategoriesService,
    private reportService: ReportsService) {
    this.settings = this.appSettings.settings;
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }

  ngOnInit() {
    this.getWeeklyProduct();
    this.getMonthlyProduct();
    this.interval = setInterval(() => {
      this.getWeeklyProduct();
      this.getMonthlyProduct();
    }, 20000);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSourceMonth.paginator = this.paginatorMonth;
    this.dataSourceStore.paginator = this.paginatorStore;
    this.analytics = analytics;
    // this.getChartData();
    this.getChartsWeek();
    this.getChartsMonth();
    this.getUserPerformanceWeek();
    this.getUserPerformanceMonth();
    // setTimeout(() => this.dataSource.paginator = this.paginator);
    this.getAllItemStore();
  }

  getWeeklyProduct() {
    this.categoryService.getProductReportCheckOutWeek(this.userToken)
      .subscribe((response) => {
        this.allProductsWeekly = response;
        this.dataSource.data = this.allProductsWeekly as AllItems[];
      },
        error => {
          this.alertService.error(error.error.message, false);
          console.log(error);
        })
  }

  getMonthlyProduct() {
    this.categoryService.getProductReportCheckOutMonth(this.userToken)
      .subscribe((response) => {
        this.allProductsMonthly = response;
        this.dataSourceMonth.data = this.allProductsMonthly as AllItems[];
      },
        error => {
          this.alertService.error(error.error.message, false);
          console.log(error);
        })
  }

  onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv !== this.resizedDiv.nativeElement.clientWidth) {
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
      }, error => {
        console.log(error);
        this.alldayChart = [
          {
            name: 'No sales',
            value: 0
          }
        ]
      })
  }
  getChartsWeek() {
    this.reportService.getWeekCheckoutReportChartDate(this.userToken)
      .subscribe((response) => {
        this.allweekChart = response;
        this.ChartWeekly();
      }, error => {
        // this.alertService.error(error.error.message, true);
        console.log(error);
        this.allweekChart = [
          {
            name: 'No sales',
            value: 0
          }
        ]
      })
  }

  getChartsMonth() {
    this.reportService.getMonthCheckoutChartByDate(this.userToken)
      .subscribe((response) => {
        this.allmonthChart = response;
        // console.log('month', this.allmonthChart)
        this.ChartMonthly();
      })
  }

  getUserPerformanceWeek() {
    this.reportService.getUserPerformanceWeek(this.userToken)
      .subscribe((response) => {
        this.userPerformanceWeek = response;
        // console.log('users', this.userPerformanceWeek)
      }, error => {
        console.log(error.error.message);
      })
  }

  getUserPerformanceMonth() {
    this.reportService.getUserPerformanceMonth(this.userToken)
      .subscribe((response) => {
        this.userPerformanceMonth = response;
        // console.log('users', this.userPerformanceMonth)
      }, error => {
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

  weeklyChart() {
    this.state = 'weekly'
  }

  monthlyChart() {
    this.state = 'monthly'
  }
  productTable() {
    this.state = 'product'
  }

  // filtering
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSourceMonth.filter = filterValue.trim().toLowerCase();
    this.dataSourceStore.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  // getting All items

  getAllItemStore(){  
    this.itemService.getAllItemsIn(this.userToken)
    .subscribe((response)=>{
      this.allItems = response
      this.dataSourceStore.data = this.allItems as AllItemsStore[]; 
       
      }),
      error =>{
        this.alertService.error(error.error.message, false);
        console.log(error)
      }
  }
  

}
