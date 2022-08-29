import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { getAuth, updatePassword } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  currentPasswordMatch: boolean;
  newPasswordMatch: boolean;

  constructor(
    private authService: AuthService,
    private angularFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async sendNewPassword() {
    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    const loading = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent',
      showBackdrop: true,
    });
    loading.present();

    this.angularFireAuth
      .signInWithEmailAndPassword(userEmail, this.currentPassword)
      .then((data) => {
        this.currentPasswordMatch = true;
        loading.dismiss();
        this.updatePassword();
      })
      .catch((error) => {
        this.currentPasswordMatch = false;
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
  } // end of checkCurrentPassword

  checkNewPassword() {
    if (this.newPassword === this.confirmNewPassword) {
      this.newPasswordMatch = true;
    } else {
      this.newPasswordMatch = false;
    }
  } // end cheNewPassword

  async updatePassword() {
    if (this.currentPasswordMatch && this.newPasswordMatch) {
      const auth = getAuth();
      const user = auth.currentUser;

      const loading = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        showBackdrop: true,
      });
      loading.present();

      updatePassword(user, this.newPassword)
        .then(() => {
          loading.dismiss();
          this.toast('¡Contraseña actualizada!', 'success');
          this.authService.signOut();
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        });
    }
  } // end of updatePassword

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
