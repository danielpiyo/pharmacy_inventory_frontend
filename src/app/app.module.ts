import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';                 //api
import { MatSidenavModule, MatTabsModule, MatAutocompleteModule, MatBadgeModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatToolbarModule, MatChipsModule, MatIconModule, MatListModule, MatCardModule, MatButtonModule, MatTableModule, MatSelectModule, MatInputModule, MatDialogModule, MatProgressBarModule, MatTooltipModule, MatDatepickerModule, MatCheckboxModule, MatExpansionModule, MatSlideToggleModule, MatProgressSpinnerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './cashier/dashboard/dashboard.component';
import { HomeComponent } from './cashier/home/home.component';
import {LoginService, AlertService, TodoService, ItemsService, CategoriesService, CheckoutService} from './_service/index';
import {AdminAuthGuard, AuthGuard} from './_guard/index';
import {AlertComponent } from './_directives/index';
import { CheckoutComponent } from './cashier/checkout/checkout.component';
import { CheckinComponent, CheckinModal } from './cashier/checkin/checkin.component';
import { CategoriesComponent } from './cashier/categories/categories.component';
import { ItemsComponent } from './cashier/items/items.component';
import {TodoComponent } from './todo/todo.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component'
import { AdminHomeComponent} from './admin-dashboard/admin-home/admin-home.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    AlertComponent,
    CheckoutComponent,
    CheckinComponent,
    CategoriesComponent,
    ItemsComponent,
    AdminDashboardComponent,
    AdminHomeComponent,
    TodoComponent,
    CheckinModal
  ],
  imports: [
    FormsModule, ReactiveFormsModule, HttpClientModule, FlexLayoutModule,
    BrowserModule, AppRoutingModule, AccordionModule,
    BrowserAnimationsModule, MatSidenavModule, MatAutocompleteModule,
    MatBadgeModule, MatSnackBarModule, MatPaginatorModule,
    MatSortModule, MatToolbarModule, MatChipsModule,
    MatIconModule, MatListModule, MatCardModule,
    MatButtonModule, MatTableModule, MatSelectModule,
    MatInputModule, MatDialogModule, MatProgressBarModule,
    MatTooltipModule, MatDatepickerModule, MatCheckboxModule,
    MatExpansionModule, MatSlideToggleModule, MatProgressSpinnerModule,
    MatNativeDateModule, NgScrollbarModule, MatTabsModule
  ],
  
  entryComponents: [
    CheckinModal
  ],
  providers: [LoginService,AlertService, AuthGuard, AdminAuthGuard, TodoService, ItemsService, CheckoutService, CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
