import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import anime from 'animejs/lib/anime.es.js';
import { BackButtonListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, BackButtonListenerEvent {
  constructor(private auth: AuthService, private router: Router) {}

  canGoBack: boolean = false;

  ngOnInit() {
    // Wrap every letter in a span
    var textWrapper = document.querySelector('.ml3');
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );

    anime.timeline({ autoplay: true }).add({
      targets: '.ml3 .letter',
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 3000,
      delay: (el, i) => 150 * (i + 1),
    });
  }

  logOut() {
    this.auth.signOut();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
