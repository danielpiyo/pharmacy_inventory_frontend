import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { Router } from '@angular/router';
import { LoginService, AlertService } from './_service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pharmacy';
  year: any;
  idleState = 'Not started.';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private alertService: AlertService) {
    this.year =  this.year = (new Date()).getFullYear();
    this.timeOut();

  }

  timeOut() {
    this.bnIdle.startWatching(300).subscribe((res) => {
      if (res) {
          console.log('session expired');
          this.logout();
          this.alertService.error('You have beeen Loged Out due to 5Minutes of inactivity. Please Login Again to proceed', true);
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

}
