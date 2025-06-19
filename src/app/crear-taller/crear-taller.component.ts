import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addTaller } from '../services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-crear-taller',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './crear-taller.component.html',
  styleUrls: ['./crear-taller.component.scss'],
})
export class CrearTallerComponent {
  titulo = '';
  descripcion = '';
  precio = 0;

  constructor(private router: Router, private toastCtrl: ToastController) {}

  async crear() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addTaller({
        uid: user.uid,
        titulo: this.titulo,
        descripcion: this.descripcion,
        precio: this.precio,
        asistentes: [],
        fecha: new Date().toISOString(),
      });

      const toast = await this.toastCtrl.create({
        message: 'Taller creado con éxito',
        duration: 1500,
        color: 'success',
      });
      toast.present();

      this.router.navigate(['/home']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Error al crear taller',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }
}
