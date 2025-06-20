import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getTodosLosTalleres } from '../services/firebase.service';
import { Router } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class HomePage implements OnInit {
  user: any = null;
  talleres: any[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = user;
    // Obtener todos los talleres
    this.talleres = await getTodosLosTalleres();
    console.log(this.talleres);
    
  }
    
  async inscribirse(tallerId: string) {
    // Funcionalidad para inscribirse a un taller
    alert('¡Te has inscrito exitosamente! 🎉');
  }

  goToCrearTaller() {
    this.router.navigate(['/crear-taller']);
  }

  goToDetalle(tallerId: string) {
    this.router.navigate(['/detalle-taller', tallerId]);
  }
}
