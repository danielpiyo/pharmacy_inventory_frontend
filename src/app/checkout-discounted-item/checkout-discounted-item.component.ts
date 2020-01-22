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
  selector: 'app-checkout-discounted-item',
  templateUrl: './checkout-discounted-item.component.html',
  styleUrls: ['./checkout-discounted-item.component.css']
})
export class CheckoutDiscountedItemComponent implements OnInit {

  loading = false;
  currentUser: User;
  userToken: any;
  dataToCheckOut: any;
  checkOutModel: TocheckOut = new TocheckOut();
  amountToSale: AmountToSale = new AmountToSale();
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
    this.hour = this.time.getHours();
    this.dataToCheckOut = this.itemService.getDataToCheckOutDiscount();
  }

  closeStep() {  // close this dialog
    this.itemService.showOpacity = false;
    setTimeout(() => {  // allow for smooth transition
      this.itemService.showStep1 = false;
    });
    if (this.currentUser.role === 'admin') {
    this.router.navigate(['/admin/item_discount']);
    } else if (this.currentUser.role === 'user') {
      this.router.navigate(['/cashier/discount']);
    } else {
      this.router.navigate(['/']);
    }
  }

  checkOutNow() {
    this.loading = true;
    // console.log(this.amountToSale.tosale);
    if (this.amountToSale.tosale == null) {
      this.alertService.error('Quantity to checkOut can not be empty');
      this.loading = false;
    } else {
     if (Number(this.amountToSale.tosale) < 1 ) {
        this.alertService.error('The Items to checkOut can not be less than one');
        this.loading = false;
      } else if (Number(this.amountToSale.tosale) > Number(this.dataToCheckOut.quantity_from)) {
        this.alertService.error('The Items to checkOut can not be greater than the available Quantity');
        this.loading = false;
      } else if (this.checkOutModel.item_price <= this.dataToCheckOut.item_buying_price) {
        this.alertService.error('Sorry you can not checkOut item with price less than or simmilar to the purchase price');
        this.loading = false;
      } else {
    this.checkOutModel.category_id = this.dataToCheckOut.category_id;
    this.checkOutModel.item_id = this.dataToCheckOut.item_id;
    this.checkOutModel.quantity_from = this.dataToCheckOut.quantity_from;
    this.checkOutModel.quantity_to = this.dataToCheckOut.quantity_from - this.amountToSale.tosale;
    this.checkOutModel.token = this.userToken;
    this.checkOutModel.discounted = 'Y';
    // console.log('CheckOutModel', this.checkOutModel);
    this.checkoutService.checkOut(this.checkOutModel)
    .subscribe((response) => {
      this.loading = false;
      this.closeStep();
      // this.generatePdf()
      // console.log('CheckoutResponce', response);
      this.alertService.success('CheckOut was Succesfull', true);
      // tslint:disable-next-line: triple-equals
      if (this.currentUser.role == 'admin') {
        this.router.navigate(['/admin/item_discount']);
        // tslint:disable-next-line: triple-equals
        } else if (this.currentUser.role == 'user') {
          this.router.navigate(['/cashier/discount']);
        } else {
          this.router.navigate(['/']);
        }
    },
    error => {
      this.loading = false;
      this.alertService.error(error.error.message, false);
      console.log(error);
    });
      }
    }
  }
  // generate pdf
  generatePdf() {
    const documentDefinition = { content: [
      {text: 'Zyptech Pharmacy',
      style: 'header', bold: true,
      fontSize: 20,
      alignment: 'center',
      margin: [0, 0, 0, 20]},
      `You have purchased, ${this.dataToCheckOut.name}(${this.dataToCheckOut.category})
       at ${this.time.getHours()}: ${this.time.getMinutes()}`,
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', 200, '*'],
          body: [
            ['Item Name', 'Quantity', 'Amount'],
            [this.dataToCheckOut.name, this.amountToSale.tosale , (this.amountToSale.tosale * this.checkOutModel.item_price)]
          ]
        }
      },
      {
        columns : [
            { qr: this.dataToCheckOut.name + ', Category : '
            + this.dataToCheckOut.category + ', Price : '
             + this.dataToCheckOut.item_price, fit : 100 },
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
