import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getInvitados, getTallerById, agregarInvitado, marcarPago } from '../services/firebase.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-detalle-taller',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss'],
})
export class DetalleTallerComponent implements OnInit {
  tallerId!: string;
  userId!: string;
  taller: any = null;
  invitados: any[] = [];

  nuevoNombre = '';
  nuevoEmail = '';

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.tallerId = this.route.snapshot.paramMap.get('id')!;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    this.userId = user.uid;

    await this.cargarTaller();
    await this.cargarInvitados();
  }

  async cargarTaller() {
    this.taller = await getTallerById(this.userId, this.tallerId);
  }

  async cargarInvitados() {
    this.invitados = await getInvitados(this.userId, this.tallerId);
  }

  async agregar() {
    if (!this.nuevoNombre || !this.nuevoEmail) return;

    await agregarInvitado(this.userId, this.tallerId, {
      nombre: this.nuevoNombre,
      email: this.nuevoEmail,
      pagado: false,
    });

    this.nuevoNombre = '';
    this.nuevoEmail = '';
    await this.cargarInvitados();

    const toast = await this.toastCtrl.create({
      message: 'Invitado agregado',
      duration: 1500,
      color: 'success'
    });
    toast.present();
  }

  async pagar(invitadoId: string) {
    await marcarPago(this.userId, this.tallerId, invitadoId);
    await this.cargarInvitados();

    const toast = await this.toastCtrl.create({
      message: 'Pago registrado',
      duration: 1500,
      color: 'primary'
    });
    toast.present();
  }
}
