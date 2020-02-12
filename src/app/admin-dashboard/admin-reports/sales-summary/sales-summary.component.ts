import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserToken } from 'src/app/_model/user';
import { ReportsService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { Settings } from '../../admin-home/app.settings.model';
import { AppSettings } from '../../admin-home/app.settings';

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.css']
})
export class SalesSummaryComponent implements OnInit {
  userToken: UserToken = new UserToken();
  salesSubscription: Subscription;
 public allSalesSummary: any[];

  public categoryDataChart: any[];
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

  constructor(private reportsService: ReportsService,  public appSettings: AppSettings) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.settings = this.appSettings.settings;
   }

  ngOnInit() {
    this.getSalesSummary();
  }

  getSalesSummary() {
    this.salesSubscription = this.reportsService.getSalesSummmaryMonth(this.userToken)
    .subscribe((response: []) => {
      this.allSalesSummary = response;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.salesSubscription) {
      this.salesSubscription.unsubscribe();
    }
  }
}
