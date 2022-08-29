import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
// import * as firebase from 'firebase/compat/app';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateEmail } from 'firebase/auth';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  userId: string;
  name: string;
  email: string;
  phone: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private angularFirestore: AngularFirestore,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.userId = user.userId;
      this.name = user.userName;
      this.email = user.userEmail;
      this.phone = user.userPhone;
    });
  }

  async updateProfile() {
    const loading = await this.loadingController.create({
      message: 'Actualizando...',
      spinner: 'crescent',
      showBackdrop: true,
    });

    loading.present();

    this.angularFirestore
      .collection('user')
      .doc(this.userId)
      .set(
        {
          userName: this.name,
          userEmail: this.email,
          userPhone: this.phone,
          editedAt: Date.now(),
        },
        { merge: true }
      )
      .then(() => {
        const cambioEmail = this.updateEmail();        
        loading.dismiss();
        
        if(cambioEmail) {
          this.toast('¡Actualización Exitosa!', 'success');
          this.router.navigate(['/profile']);
        } else {
          this.toast('¡Reinicie sesión para modificar email!', 'warning');
          this.router.navigate(['/profile']);
        }
      })
      .catch((error) => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
  } // end of updateProfile

  updateEmail() : boolean {
    const auth = getAuth();
    let rtn: boolean = false;

    if (auth.currentUser.email !== this.email) {      
      updateEmail(auth.currentUser, this.email)
        .then(() => {
          console.log('¡Email actualizado!');
          rtn = true;
        })
        .catch((error) => {
          console.log('¡El email no se actualizó!');
        });
    } else {
      rtn = true;
    }
    return rtn;
  } // end of updateEmail

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
