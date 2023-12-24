import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductsComponent } from './pages/products/products.component';
import { UsersComponent } from './pages/users/users.component';
import { ContentComponent } from './pages/content/content.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { ContentDetailsComponent } from './pages/content-details/content-details.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'content', component: ContentComponent },
  { path: 'content/:id', component: ContentDetailsComponent },
];
