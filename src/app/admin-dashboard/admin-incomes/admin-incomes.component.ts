import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserToken } from 'src/app/_model/user';
import { ReportsService, AlertService } from 'src/app/_service';
import { ExpencesService } from 'src/app/_service/expences.service';
import { Subscription } from 'rxjs';
import { Settings } from '../admin-home/app.settings.model';
import { AppSettings } from '../admin-home/app.settings';
import { MonthlyExpenceChart } from './monthlyExpence.model';

@Component({
  selector: 'app-admin-incomes',
  templateUrl: './admin-incomes.component.html',
  styleUrls: ['./admin-incomes.component.css']
})
export class AdminIncomesComponent implements OnInit {
  userToken: UserToken = new UserToken();
  allMonthlyIncome: any;
  allMothlyCost: any;
  costSubscription: Subscription;
  salesSubscription: Subscription;
  expencesSubscription: Subscription;
  allMothlySales: any;
  allMothlyExpences: MonthlyExpenceChart[];
  totalMonthlyExpence: any;
  profitLoss: number;

  public showLegend = true;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060', '#4bc0c0', '#565656',
      '#FF6384', '#36A2EB', '#FFCE56', '#4bc0c0', '#565656']
  };
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = true;
  public settings: Settings;
  date: any;

  constructor(private reportService: ReportsService,
              private expencesService: ExpencesService,
              private alertService: AlertService,
              public appSettings: AppSettings) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getMonthSales();
    this.getMonthlyCost();
    this.getMonthlyExpences();
    this.date = new Date();
  }

  getMonthSales() {
    this.salesSubscription = this.reportService.getSalesMonthly(this.userToken)
      .subscribe((res) => {
        this.allMothlySales = res[0].selling;
        console.log(this.allMothlySales);
      }, error => {
        console.log(error);
      });
  }

  getMonthlyCost() {
    this.costSubscription = this.reportService.getCostMonthly(this.userToken)
      .subscribe((res) => {
        this.allMothlyCost = res[0].buying;
        console.log(this.allMothlyCost);
        this.allMonthlyIncome = (this.allMothlySales - this.allMothlyCost);
        console.log('Income', this.allMonthlyIncome);
      }, error => {
        console.log(error);
      });
  }

  getMonthlyExpences() {
    this.expencesSubscription = this.expencesService.getMonthlyExpences(this.userToken)
      .subscribe((res: []) => {
        this.allMothlyExpences = res;
        console.log(this.allMothlyExpences);
        let total = 0;
        if (this.allMothlyExpences != null && this.allMothlyExpences.length > 0) {
          this.allMothlyExpences.forEach(x => total += x.value);
        }
        // console.log(total);
        this.totalMonthlyExpence = total;
        this.profitLoss = (this.allMonthlyIncome - this.totalMonthlyExpence);
        console.log('total', this.totalMonthlyExpence);
        console.log('ProfitLoss', this.profitLoss);
      }, error => {
        this.totalMonthlyExpence = 0;
        this.profitLoss = (this.allMonthlyIncome - this.totalMonthlyExpence);
        console.log(error);
      });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.costSubscription) {
      this.costSubscription.unsubscribe();
    } else if (this.salesSubscription) {
      this.salesSubscription.unsubscribe();
    } else if (this.expencesSubscription) {
      this.expencesSubscription.unsubscribe();
    }
  }
}
