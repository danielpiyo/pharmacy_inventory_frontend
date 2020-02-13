import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// api
import {
  MatSidenavModule, MatFormFieldModule, MatTabsModule,
  MatAutocompleteModule, MatBadgeModule, MatSnackBarModule,
  MatPaginatorModule, MatToolbarModule, MatChipsModule,
  MatIconModule, MatListModule, MatCardModule, MatButtonModule, MatTableModule,
  MatSelectModule, MatInputModule, MatDialogModule, MatProgressBarModule,
  MatTooltipModule, MatDatepickerModule, MatCheckboxModule, MatExpansionModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatNativeDateModule
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './cashier/dashboard/dashboard.component';
import { HomeComponent } from './cashier/home/home.component';
import { LoginService, AlertService, TodoService, ItemsService, CategoriesService, CheckoutService } from './_service/index';
import { AdminAuthGuard, AuthGuard } from './_guard/index';
import { AlertComponent } from './_directives/index';
import { CheckoutComponent } from './cashier/checkout/checkout.component';
import { CheckinComponent, CheckinModal } from './cashier/checkin/checkin.component';
import { CategoriesComponent, MoreCategoriesModal } from './cashier/categories/categories.component';
import { ItemsComponent, DetailsModal } from './cashier/items/items.component';
import { TodoComponent } from './cashier/todo/todo.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'
import { AdminHomeComponent, CheckedInModel } from './admin-dashboard/admin-home/admin-home.component';
import { UsersComponent, NewUserModal, ResetUserModal, DeleteUserModal } from './admin-dashboard/users/users.component';
// tslint:disable-next-line: import-spacing
import { AdminCategoriesComponent, CategoryModal, NewCategoryModal, DeleteCategoryModal }
  from './admin-dashboard/admin-categories/admin-categories.component';
// tslint:disable-next-line: import-spacing
import { AdminItemsComponent, AdminDetailsModal, NewItemModal, AdminEditDetailsModal, AdminDeleteItemModal }
  from './admin-dashboard/admin-items/admin-items.component';
import { AdminReportsComponent } from './admin-dashboard/admin-reports/admin-reports.component';
import { AdminCheckinComponent, AdminCheckinModal } from './admin-dashboard/admin-checkin/admin-checkin.component';
import { AdminCheckoutComponent } from './admin-dashboard/admin-checkout/admin-checkout.component';
import { AppSettings } from './admin-dashboard/admin-home/app.settings';
import { InfoCardsComponent } from './admin-dashboard/info-cards/info-cards.component';
import { BubbleComponent } from './admin-dashboard/bubble/bubble.component';

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
import { SalesSummaryComponent } from './admin-dashboard/admin-reports/sales-summary/sales-summary.component';
import { AdminExpencesComponent, AdminNewExpencesModal } from './admin-dashboard/admin-expences/admin-expences.component';
import { ExpencesService } from './_service/expences.service';
import { AdminIncomesComponent } from './admin-dashboard/admin-incomes/admin-incomes.component';
import { AdminExpireComponent } from './admin-dashboard/admin-expire/admin-expire.component';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

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
    CheckinModal, NewUserModal,
    DetailsModal,
    UsersComponent, ResetUserModal,
    AdminCategoriesComponent,
    AdminItemsComponent,
    AdminReportsComponent,
    AdminCheckinComponent, BubbleComponent,
    AdminCheckoutComponent, InfoCardsComponent,
    CategoryModal, AdminDetailsModal, AdminCheckinModal, DeleteUserModal,
    NewItemModal, AdminEditDetailsModal, NewCategoryModal,
    ChangePriceComponent, ChangePriceModal, ItemBalanceComponent, DeleteCategoryModal,
    MoreItemModal, DiscountedItemComponentChashier, CheckedInModel, AdminDeleteItemModal,
    SalesReportComponent, MoreCategoriesModal, DiscountedItemComponent,
     CheckoutDiscountedItemComponent, SalesSummaryComponent, AdminExpencesComponent,
      AdminNewExpencesModal, AdminIncomesComponent, AdminExpireComponent
  ],
  imports: [
    FormsModule, ReactiveFormsModule, HttpClientModule, FlexLayoutModule,
    BrowserModule, routing,
    BrowserAnimationsModule, MatSidenavModule, MatAutocompleteModule,
    MatBadgeModule, MatSnackBarModule, MatPaginatorModule,
    MatSortModule, MatToolbarModule, MatChipsModule,
    MatIconModule, MatListModule, MatCardModule, NgxChartsModule,
    MatButtonModule, MatTableModule, MatSelectModule,
    MatInputModule, MatDialogModule, MatProgressBarModule,
    MatTooltipModule, MatDatepickerModule, MatCheckboxModule,
    MatExpansionModule, MatSlideToggleModule, MatProgressSpinnerModule, NgxDonutChartModule,
    MatNativeDateModule, NgScrollbarModule, MatTabsModule, MatFormFieldModule, PerfectScrollbarModule
  ],
  entryComponents: [
    CheckinModal, DetailsModal, CategoryModal, AdminDetailsModal, AdminCheckinModal, AdminNewExpencesModal,
    NewItemModal, AdminEditDetailsModal, NewCategoryModal, NewUserModal, ResetUserModal, DeleteUserModal,
    ChangePriceModal, MoreItemModal, MoreCategoriesModal, CheckedInModel, AdminDeleteItemModal, DeleteCategoryModal
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }, BnNgIdleService,
    AppSettings, LoginService, AlertService, AuthGuard, AdminAuthGuard, TodoService,
     ItemsService, CheckoutService, CategoriesService, ExpencesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
