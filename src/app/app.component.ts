import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { Router } from '@angular/router';
import { LoginService, AlertService } from './_service';
import { UserToken } from './_model/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pharmacy';
  year: any;
  idleState = 'Not started.';
  userToken: UserToken = new UserToken();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private alertService: AlertService) {
    this.year =  this.year = (new Date()).getFullYear();
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
    // console.log('this.userToken.token', this.userToken.token);
    this.timeOut();

  }

  timeOut() {
    this.bnIdle.startWatching(360).subscribe((res) => {
      if (res) {
          console.log('session expired');
          this.logout();
          if (this.userToken.token != null) {
            this.alertService.error('You have beeen Loged Out due to inactivity. Please Login Again to proceed', true);
          }
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

}
