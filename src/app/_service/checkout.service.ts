import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TocheckOut } from '../_model/checkOut';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

  checkOut(checkOutModel: TocheckOut){
    return this.http.post(`${environment.baseUrl}/checkOut`, checkOutModel);
  }

}
