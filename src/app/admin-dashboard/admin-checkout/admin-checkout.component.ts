import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CheckoutService } from 'src/app/_service/checkout.service';
import { User } from 'src/app/_model/user';
import { TocheckOut, AmountToSale } from 'src/app/_model/checkOut';
import { ItemsService, AlertService } from 'src/app/_service';
import { Router } from '@angular/router';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-admin-checkout',
  templateUrl: './admin-checkout.component.html',
  styleUrls: ['./admin-checkout.component.css']
})
export class AdminCheckoutComponent implements OnInit {

  loading = false;
  currentUser: User; 
  userToken: any; 
  dataToCheckOut: any;
  checkOutModel: TocheckOut = new TocheckOut();
  amountToSale: AmountToSale = new AmountToSale()
  time: any;
  hour: any;
  minutes: any;
  
  constructor(
    private itemService: ItemsService,
    private checkoutService: CheckoutService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userToken = JSON.parse(localStorage.getItem('currentToken'));
   }

  ngOnInit() {
    this.time = new Date();
    this.hour = this.time.getHours()
    this.dataToCheckOut = this.itemService.getDataToCheckOut();
  }

  closeStep() {  // close this dialog
    this.itemService.showOpacity = false;
    setTimeout(() => {  // allow for smooth transition
      this.itemService.showStep1 = false;
    })
    this.router.navigate(['/admin/checkin']);
  }

  checkOutNow(){
    this.loading = true;
    this.checkOutModel.category_id = this.dataToCheckOut.category_id;
    this.checkOutModel.item_id = this.dataToCheckOut.item_id;
    this.checkOutModel.item_price = this.dataToCheckOut.item_price;
    this.checkOutModel.quantity_from = this.dataToCheckOut.quantity_from;
    this.checkOutModel.quantity_to = this.dataToCheckOut.quantity_from - this.amountToSale.tosale;
    this.checkOutModel.token = this.userToken;
    console.log('CheckOutModel', this.checkOutModel);
    this.checkoutService.checkOut(this.checkOutModel)
    .subscribe((response)=>{
      this.loading = false;
      this.closeStep();
      console.log('CheckoutResponce', response);
      this.alertService.success('CheckOut was Succesfull', true);
      this.router.navigate(['/admin/checkin']);     
    },
    error =>{
      this.loading = false;
      this.alertService.error(error.error.message)
      console.log(error)
    })
  }
  // generate pdf
  generatePdf(){
    const documentDefinition = { content: [
      {text: 'Zyptech Pharmacy',
      style: 'header', bold: true,
      fontSize: 20,
      alignment: 'center',
      margin: [0, 0, 0, 20]},
      `You have purchased, ${this.dataToCheckOut.name}(${this.dataToCheckOut.category}) at ${this.time.getHours()}: ${this.time.getMinutes()}`,
      
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', 200, '*'],
          body: [
            ['Item Name', 'Quantity', 'Amount'],
            [this.dataToCheckOut.name, this.amountToSale.tosale , (this.amountToSale.tosale * this.dataToCheckOut.item_price)]
          ]
        }
      },
      {
        columns : [
            { qr: this.dataToCheckOut.name + ', Category : ' + this.dataToCheckOut.category + ', Price : ' + this.dataToCheckOut.item_price, fit : 100 },
            {
            text: `(${this.dataToCheckOut.name})`,
            alignment: 'right',
            }
        ]
      }
    ] };
    pdfMake.createPdf(documentDefinition).print();
   }

}
