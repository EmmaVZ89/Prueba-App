import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  destinationRoute: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.destinationRoute = this.route.snapshot.params['route'];
    setTimeout(() => {
      this.router.navigate([`/${this.destinationRoute}`]);
    }, 1500);

    // Wrap every letter in a span
    var textWrappers = document.querySelectorAll('.ml3');
    for (let i = 0; i < textWrappers.length; i++) {
      const textWrapper = textWrappers[i];
      textWrapper.innerHTML = textWrapper.textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      );
    }

    anime.timeline({ autoplay: true }).add({
      targets: '.ml3 .letter',
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 1000,
      delay: (el, i) => 25 * (i + 1),
    });
  } // end of ngOnInit
}
