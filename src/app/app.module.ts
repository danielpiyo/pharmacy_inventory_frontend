import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
               //api
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
import { CategoriesComponent, MoreCategoriesModal } from './cashier/categories/categories.component';
import { ItemsComponent, DetailsModal } from './cashier/items/items.component';
import {TodoComponent } from './cashier/todo/todo.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component'
import { AdminHomeComponent} from './admin-dashboard/admin-home/admin-home.component';
import { UsersComponent, NewUserModal, ResetUserModal } from './admin-dashboard/users/users.component';
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
import { ChangePriceComponent, ChangePriceModal } from './admin-dashboard/change-price/change-price.component';
import { ItemBalanceComponent, MoreItemModal } from './item-balance/item-balance.component';
import { SalesReportComponent } from './cashier/sales-report/sales-report.component';
import { DiscountedItemComponentChashier } from './cashier/discounted-item/discounted-item.component';
import { DiscountedItemComponent } from './admin-dashboard/discounted-item/discounted-item.component';
import { CheckoutDiscountedItemComponent } from './checkout-discounted-item/checkout-discounted-item.component';

 
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
    UsersComponent, ResetUserModal,
    AdminCategoriesComponent,
    AdminItemsComponent,
    AdminReportsComponent,
    AdminCheckinComponent,BubbleComponent,
    AdminCheckoutComponent, InfoCardsComponent,
    CategoryModal, AdminDetailsModal, AdminCheckinModal, 
    NewItemModal, AdminEditDetailsModal, NewCategoryModal,
     ChangePriceComponent,ChangePriceModal, ItemBalanceComponent,
     MoreItemModal, DiscountedItemComponentChashier,
     SalesReportComponent, MoreCategoriesModal, DiscountedItemComponent, CheckoutDiscountedItemComponent
  ],
  imports: [
    FormsModule, ReactiveFormsModule, HttpClientModule, FlexLayoutModule,
    BrowserModule, AppRoutingModule, 
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
    NewItemModal, AdminEditDetailsModal, NewCategoryModal,NewUserModal,ResetUserModal,
     ChangePriceModal, MoreItemModal,MoreCategoriesModal
  ],
  providers: [ {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
            }, 
  AppSettings, LoginService,AlertService, AuthGuard, AdminAuthGuard, TodoService, ItemsService, CheckoutService, CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
