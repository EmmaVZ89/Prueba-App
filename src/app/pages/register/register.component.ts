import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  passwordMatch: boolean;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async register() {
    if (this.name && this.email && this.phone && this.password) {
      const loading = await this.loadingController.create({
        message: 'Procesando...',
        spinner: 'crescent',
        showBackdrop: true,
      });

      loading.present();

      this.angularFireAuth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          // data.user.sendEmailVerification();
          this.angularFirestore
            .collection('user')
            .doc(data.user.uid)
            .set({
              userId: data.user.uid,
              userName: this.name,
              userEmail: this.email,
              userPhone: this.phone,
              createdAt: Date.now(),
            })
            .then(() => {
              loading.dismiss();
              this.toast(
                '¡Registro exitoso!',
                'success'
              );
              // this.router.navigate(['/login']);
            })
            .catch((error) => {
              loading.dismiss();
              this.toast(error.message, 'danger');
            });
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        });
    } else {
      this.toast('¡Por favor completa todos los campos!', 'warning');
    }
  } // end of register

  checkPassword() {
    if (this.password === this.confirmPassword) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  } // end of checkPassword

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
