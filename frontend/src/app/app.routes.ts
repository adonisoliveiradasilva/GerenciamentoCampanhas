import { Routes, Router } from '@angular/router';
import { inject, Component } from '@angular/core';
import { Login } from './pages/login/login'; 
import { MainLayout } from './components/templates/main-layout/main-layout';

@Component({
  standalone: true,
  template: '<h1 style="color: var(--color-text-primary); text-align: center; margin-top: 3rem;">Dashboard de Doações</h1>'
})
export class DashboardStub {}

const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  
  if (token) return true; 
  
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { 
    path: 'login', 
    component: Login 
  },
  
  { 
    path: '', 
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardStub },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  { path: '**', redirectTo: '' }
];