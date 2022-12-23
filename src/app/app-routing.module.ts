import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { DetailUserComponent } from './components/detail-user/detail-user.component';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './core/auth/login/login.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListUserComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'user/:id',
    component: DetailUserComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'create',
    component: DetailUserComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'edit/:id',
    component: DetailUserComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    component: LoginComponent
  },

  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: '**', redirectTo: '/list', pathMatch: 'full' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
