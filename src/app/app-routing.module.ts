import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './cashier/dashboard/dashboard.component';
import { AuthGuard, AdminAuthGuard } from './_guard';
import { HomeComponent } from './cashier/home/home.component';
import { CheckoutComponent } from './cashier/checkout/checkout.component';
import { CategoriesComponent } from './cashier/categories/categories.component';
import { ItemsComponent } from './cashier/items/items.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './admin-dashboard/admin-home/admin-home.component';
import { CheckinComponent } from './cashier/checkin/checkin.component';
import { UsersComponent } from './admin-dashboard/users/users.component';
import { AdminCategoriesComponent } from './admin-dashboard/admin-categories/admin-categories.component';
import { AdminItemsComponent } from './admin-dashboard/admin-items/admin-items.component';
import { AdminReportsComponent } from './admin-dashboard/admin-reports/admin-reports.component';
import { AdminCheckinComponent } from './admin-dashboard/admin-checkin/admin-checkin.component';
import { AdminCheckoutComponent } from './admin-dashboard/admin-checkout/admin-checkout.component';
import { InfoCardsComponent } from './admin-dashboard/info-cards/info-cards.component';
import { TodoComponent } from './cashier/todo/todo.component';
import { ChangePriceComponent } from './admin-dashboard/change-price/change-price.component';
import { SalesReportComponent } from './cashier/sales-report/sales-report.component';
import { DiscountedItemComponent } from './admin-dashboard/discounted-item/discounted-item.component';
import { DiscountedItemComponentChashier } from './cashier/discounted-item/discounted-item.component';


const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'cashier', component:DashboardComponent, canActivate:[AuthGuard], children:[
    {path:'', component:HomeComponent},  
    {path:'todo', component:TodoComponent, canActivate:[AuthGuard]},  
    {path:'checkout', component:CheckoutComponent, canActivate:[AuthGuard]},
    {path:'checkin', component: CheckinComponent, canActivate:[AuthGuard]},
    {path:'categories', component:CategoriesComponent, canActivate:[AuthGuard]},
    {path:'items', component:ItemsComponent, canActivate:[AuthGuard]},
    {path:'user_report', component:SalesReportComponent, canActivate:[AuthGuard]},
    {path:'discount', component:DiscountedItemComponentChashier, canActivate:[AuthGuard]},
    // otherwise redirect to Cashier dashboard
    {path: '**', redirectTo: '' }
  ]},
  {path:'admin', component:AdminDashboardComponent, canActivate:[AdminAuthGuard], children:[
    {path:'', component:AdminHomeComponent, canActivate:[AdminAuthGuard]},
    {path:'users', component:UsersComponent, canActivate:[AdminAuthGuard]},
    {path:'categories', component:AdminCategoriesComponent, canActivate:[AdminAuthGuard]},
    {path:'items', component:AdminItemsComponent, canActivate:[AdminAuthGuard]},
    {path:'reports', component:AdminReportsComponent, canActivate:[AdminAuthGuard]},
    {path:'checkin', component:AdminCheckinComponent, canActivate:[AdminAuthGuard]},
    {path:'checkout', component:AdminCheckoutComponent, canActivate:[AdminAuthGuard]},
    {path:'info', component:InfoCardsComponent, canActivate:[AdminAuthGuard]},
    {path:'changePrice', component: ChangePriceComponent, canActivate:[AdminAuthGuard]},
    {path:'item_discount', component:DiscountedItemComponent, canActivate:[AdminAuthGuard]},
    // otherwise redirect to AdminDashboard
    {path: '**', redirectTo: '' }
  ]},
 // otherwise redirect to Login
 {path: '**', redirectTo: '' }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
export const routing = RouterModule.forRoot(routes,  {useHash: true}); 