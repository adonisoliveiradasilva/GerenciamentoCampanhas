import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from './pages/login/login'; 
import { MainLayout } from './components/templates/main-layout/main-layout';
import { Usuarios } from './pages/usuarios/usuarios';

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
      { 
        path: 'usuarios', 
        component: Usuarios, 
        data: { breadcrumb: 'Usuários' }
      },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];