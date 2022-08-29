import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  email: string;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async resetPassword() {
    if (this.email) {
      const loading = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        showBackdrop: true,
      });
      loading.present();

      this.angularFireAuth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          loading.dismiss();
          this.toast('¡Por favor verifica tu email!', 'success');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        });
    } else {
      this.toast('¡Por favor ingresa tu dirección de email!', 'danger');
    }
  } // end of resetPassword

  async toast(message, status) {
    const toast = await this.toastController.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000,
    });

    toast.present();
  } // end of toast
}
