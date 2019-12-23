import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';                 //api
import { MatSidenavModule, MatFormFieldModule, MatTabsModule, MatAutocompleteModule, MatBadgeModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatToolbarModule, MatChipsModule, MatIconModule, MatListModule, MatCardModule, MatButtonModule, MatTableModule, MatSelectModule, MatInputModule, MatDialogModule, MatProgressBarModule, MatTooltipModule, MatDatepickerModule, MatCheckboxModule, MatExpansionModule, MatSlideToggleModule, MatProgressSpinnerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
import { ItemsComponent, DetailsModal } from './cashier/items/items.component';
import {TodoComponent } from './cashier/todo/todo.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component'
import { AdminHomeComponent} from './admin-dashboard/admin-home/admin-home.component';
import { UsersComponent, NewUserModal } from './admin-dashboard/users/users.component';
import { AdminCategoriesComponent, CategoryModal, NewCategoryModal } from './admin-dashboard/admin-categories/admin-categories.component';
import { AdminItemsComponent, AdminDetailsModal, NewItemModal, AdminEditDetailsModal } from './admin-dashboard/admin-items/admin-items.component';
import { AdminReportsComponent } from './admin-dashboard/admin-reports/admin-reports.component';
import { AdminCheckinComponent, AdminCheckinModal } from './admin-dashboard/admin-checkin/admin-checkin.component';
import { AdminCheckoutComponent } from './admin-dashboard/admin-checkout/admin-checkout.component'
import { AppSettings } from './admin-dashboard/admin-home/app.settings';
import { InfoCardsComponent } from './admin-dashboard/info-cards/info-cards.component';
import {BubbleComponent} from './admin-dashboard/bubble/bubble.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxDonutChartModule } from 'ngx-doughnut-chart';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


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
    CheckinModal,NewUserModal,
    DetailsModal,
    UsersComponent,
    AdminCategoriesComponent,
    AdminItemsComponent,
    AdminReportsComponent,
    AdminCheckinComponent,BubbleComponent,
    AdminCheckoutComponent, InfoCardsComponent,
    CategoryModal, AdminDetailsModal, AdminCheckinModal, NewItemModal, AdminEditDetailsModal, NewCategoryModal
  ],
  imports: [
    FormsModule, ReactiveFormsModule, HttpClientModule, FlexLayoutModule,
    BrowserModule, AppRoutingModule, AccordionModule,
    BrowserAnimationsModule, MatSidenavModule, MatAutocompleteModule,
    MatBadgeModule, MatSnackBarModule, MatPaginatorModule,
    MatSortModule, MatToolbarModule, MatChipsModule,
    MatIconModule, MatListModule, MatCardModule, NgxChartsModule,
    MatButtonModule, MatTableModule, MatSelectModule,
    MatInputModule, MatDialogModule, MatProgressBarModule,
    MatTooltipModule, MatDatepickerModule, MatCheckboxModule,
    MatExpansionModule, MatSlideToggleModule, MatProgressSpinnerModule,NgxDonutChartModule,
    MatNativeDateModule, NgScrollbarModule, MatTabsModule, MatFormFieldModule, PerfectScrollbarModule
  ],
  
  entryComponents: [
    CheckinModal, DetailsModal, CategoryModal, AdminDetailsModal, AdminCheckinModal, 
    NewItemModal, AdminEditDetailsModal, NewCategoryModal,NewUserModal
  ],
  providers: [ {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
            }, 
  AppSettings, LoginService,AlertService, AuthGuard, AdminAuthGuard, TodoService, ItemsService, CheckoutService, CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
