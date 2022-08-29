import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import fire from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  user: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private LoadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`user/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  } // end of constructor

  async signIn(email, password) {
    const loading = await this.LoadingController.create({
      message: 'Verificando...',
      spinner: 'crescent',
      showBackdrop: true,
    });

    loading.present();

    this.angularFireAuth
      .setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth
          .signInWithEmailAndPassword(email, password)
          .then((data) => {
            if (!data.user.emailVerified) {
              data.user.sendEmailVerification();
              loading.dismiss();
              this.toast(
                '¡Por favor verifica tu dirección de email!',
                'warning'
              );
              this.angularFireAuth.signOut();
            } else {
              loading.dismiss();
              this.router.navigate(['/home']);
            }
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
  } // end of signIn

  async signInWithGoogle() {
    try {
      return await this.angularFireAuth.signInWithPopup(
        new fire.auth.GoogleAuthProvider()
      );
    } catch (error) {
      console.error('Error en login con Google: ', error.message);
      return null;
    }
  } // end of signInWithGoogle

  async signOut() {
    const loading = await this.LoadingController.create({
      spinner: 'crescent',
      showBackdrop: true,
    });
    loading.present();
    
    this.angularFireAuth.signOut()
    .then(() => {
      loading.dismiss();
      this.router.navigate(['/login']);
    });
  } // end of signOut

  getUserLogged() {
    return this.angularFireAuth.authState;
  } // end of getUserLogged

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
