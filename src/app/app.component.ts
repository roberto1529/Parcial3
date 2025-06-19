import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet ],
})
export class AppComponent {
   isAuthenticated = false;

  constructor(private router: Router) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}
