import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login, LoginResponse } from '../_model/login.model';
import { AlertService, LoginService } from '../_service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loading = false;
  currentPerson: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private loginService: LoginService
  ) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")]],
      password: ['', Validators.required]
    })
  }

  loginUser() {
    this.loading = true
    const formData = this.loginForm.value;

    const payload: Login = {
      email: formData.email,
      password: formData.password
    }

    // console.log("Login", payload);
    this.loginService.logIn(payload)
    .subscribe((data: LoginResponse) => {
      // console.log(data)
      // console.log(data.user)
      this.currentPerson = data.user;
      if (data.token) {
        // storing the token
        localStorage.setItem('currentToken', JSON.stringify(data.token));
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        switch (this.currentPerson.role) {
          case 'user':
            this.alertService.success('You have succesfully Loged In as a Cashier')
            this.router.navigate(['/cashier']);
            break;
          case 'admin':
            this.alertService.success('You have succesfully Loged In as an Administrator')
            this.router.navigate(['/admin']);
            this.loading = false;          
            break;
        }
      }
    }, error => {
      this.loading = false;
      this.alertService.error(error.error.message)
      console.log(error)
    })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

}
