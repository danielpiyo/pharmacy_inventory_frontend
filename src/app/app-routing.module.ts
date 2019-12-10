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


const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'cashier', component:DashboardComponent, canActivate:[AuthGuard], children:[
    {path:'', component:HomeComponent},    
    {path:'checkout', component:CheckoutComponent, canActivate:[AuthGuard]},
    {path:'checkin', component: CheckinComponent, canActivate:[AuthGuard]},
    {path:'categories', component:CategoriesComponent, canActivate:[AuthGuard]},
    {path:'items', component:ItemsComponent, canActivate:[AuthGuard]}
  ]},
  {path:'admin', component:AdminDashboardComponent, canActivate:[AdminAuthGuard], children:[
    {path:'', component:AdminHomeComponent, canActivate:[AdminAuthGuard]}
  ]},
 // otherwise redirect to Login
 {path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
