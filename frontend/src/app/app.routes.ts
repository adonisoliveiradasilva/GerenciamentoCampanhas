import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from './pages/login/login'; 
import { MainLayout } from './components/templates/main-layout/main-layout';
import { Usuarios } from './pages/usuarios/usuarios';
import { MeusDados } from './pages/meus-dados/meus-dados';
import { UserService } from './domains/user/services/user.service';
import { Campanhas } from './pages/campanhas/campanhas';
import { Doadores } from './pages/doadores/doadores';

const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  
  if (token) return true; 
  
  router.navigate(['/login']);
  return false;
};

const adminGuard = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  const user = userService.currentUser() || userService.getLoggedUser();

  if (user && user.role === 'Administrador') {
    return true;
  }

  router.navigate(['/perfil']);
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
        canActivate: [adminGuard],
        data: { breadcrumb: 'Usuários' }
      },
      { 
        path: 'campanhas', 
        component: Campanhas, 
        data: { breadcrumb: 'Campanhas' }
      },
      { 
        path: 'doadores', 
        component: Doadores, 
        data: { breadcrumb: 'Doadores' }
      },
      { 
        path: 'perfil', 
        component: MeusDados, 
        data: { breadcrumb: 'Meu Perfil' }
      },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];