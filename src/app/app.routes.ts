import { Routes } from '@angular/router';
import { LoginPage } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage

  },
  {
    path: 'home',
    loadComponent: () => import('./../app/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'crear-taller',
    loadComponent: () => import('./../app/crear-taller/crear-taller.component').then(m => m.CrearTallerComponent),
  },
 {
  path: 'detalle-taller/:id',
  loadComponent: () => import('./../app/detalle-taller/detalle-taller.component').then(m => m.DetalleTallerComponent),
}

];
