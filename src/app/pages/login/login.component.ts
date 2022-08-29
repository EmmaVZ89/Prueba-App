import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

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
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.getUserLogged().subscribe((res) => {
      if (res !== null) {
        this.router.navigate(['/home']);
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

  async toast(message, status) {
    const toast = await this.toastController.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000,
    });
    toast.present();
  } // end of toast

  gmailLogin() {
    this.auth.signInWithGoogle().then((res) => {
      console.log('Usuario logueado con google: ', res);
    });
  } // end of gmailLogin

  // ***************************
  // ***************************
  // ***************************

  facebookLogin() {}

  twitterLogin() {}

  touchLogin() {}

  faceLogin() {}
}
