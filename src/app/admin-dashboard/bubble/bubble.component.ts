import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
// import {disk_space } from '../admin-home/charts.data';
import { ReportsService } from 'src/app/_service';
import { UserToken } from 'src/app/_model/user';


@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html'
})
export class BubbleComponent implements OnInit, AfterViewChecked {
  userPerformance: any[];
  userToken: UserToken = new UserToken();
  public data: any[];
  public showLegend = false;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B']
  };
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = false;
  @ViewChild('resizedDiv', null) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv = 0;

  constructor(
    private reportService: ReportsService
  ) { 
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    this.getUserPerformance();
  }

  ngOnInit() {
    // this.data = this.disk_space;
    console.log('data', this.data)
    
  }

  public onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv !== this.resizedDiv.nativeElement.clientWidth) {
      setTimeout(() => this.disk_space );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

  getUserPerformance(){
    this.reportService.getUserPerformanceWeek(this.userToken)
    .subscribe((response:any[]) => {
      this.userPerformance = response;       
     console.log('users',this.userPerformance)
     this.Chart();
    },error=>{
      console.log(error.error.message);
    })
  }

  disk_space: any[]; 
  Chart() {
    this.disk_space = this.userPerformance;
    console.log('disk', this.disk_space);
  }
}