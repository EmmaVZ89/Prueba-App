import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: any = {
    email: '',
    password: '',
  };

  type: boolean = true;
  name: boolean = true;

  constructor(
    private auth: AuthService,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private alertController: AlertController
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   if (this.routerOutlet.canGoBack()) {
    //     this.presentAlert();
    //   }
    // });
  }

  ngOnInit() {
    this.auth.getUserLogged().subscribe((res) => {
      if (res !== null) {
        this.router.navigate(['/splash/home']);
      }
    });
  }

  changeType() {
    this.type = !this.type;
    this.name = !this.name;
  } // end of changeType

  loginUser() {
    if (this.login.email && this.login.password) {
      this.auth.signIn(this.login.email, this.login.password);
    } else {
      this.toast('¡Por favor completa todos los campos!', 'warning');
    }
  } // end of loginUser

  loadFastUser(numUser: number) {
    switch (numUser) {
      case 1:
        this.login.email = 'usuario1@mail.com';
        this.login.password = 'usuario1234';
        this.toast(
          '¡Usuario 1 cargado, ahora puedes INGRESAR!',
          'light',
          'bottom'
        );
        break;
      case 2:
        this.login.email = 'usuario2@mail.com';
        this.login.password = 'usuario1234';
        this.toast(
          '¡Usuario 2 cargado, ahora puedes INGRESAR!',
          'primary',
          'bottom'
        );
        break;
      case 3:
        this.login.email = 'usuario3@mail.com';
        this.login.password = 'usuario1234';
        this.toast(
          '¡Usuario 3 cargado, ahora puedes INGRESAR!',
          'success',
          'bottom'
        );
        break;
      default:
        break;
    }
  } // end of loadFastUser

  async toast(message, status, position?) {
    try {
      if (!position) {
        const toast = await this.toastController.create({
          message: message,
          color: status,
          position: 'top',
          duration: 2000,
        });
        toast.present();
      } else {
        const toast = await this.toastController.create({
          message: message,
          color: status,
          position: position,
          duration: 2000,
        });
        toast.present();
      }
    } catch (error) {
      console.log(error.message);
    }
  } // end of toast

  gmailLogin() {
    this.auth.signInWithGoogle().then((res) => {
      console.log('Usuario logueado con google: ', res);
    });
  } // end of gmailLogin

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Desea salir de la aplicación?!',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'NO',
          cssClass: 'alert-button-cancel',
          handler: () => {
            // this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'SI',
          cssClass: 'alert-button-confirm',
          handler: () => {
            // this.handlerMessage = 'Alert confirmed';
            App.exitApp();
          },
        },
      ],
    });

    await alert.present();
    // const { role } = await alert.onDidDismiss();
  } // end of presentAlert

  // ***************************
  // ***************************
  // ***************************

  facebookLogin() {}

  twitterLogin() {}

  touchLogin() {}

  faceLogin() {}
}
