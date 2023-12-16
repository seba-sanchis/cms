import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  links = [
    {
      name: 'Dashboard',
      url: '/',
      icon: 'dashboard',
    },
    {
      name: 'Órdenes',
      url: '/orders',
      icon: 'inbox',
    },
    {
      name: 'Productos',
      url: '/products',
      icon: 'sell',
    },
    {
      name: 'Usuarios',
      url: '/users',
      icon: 'person',
    },
    {
      name: 'Contenido',
      url: '/content',
      icon: 'image',
    },
  ];

  activeLink: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.activeLink = event.url;
      });
  }

  isActiveLink(url: string): boolean {
    if (url === '/') {
      return this.activeLink === url;
    } else {
      return this.activeLink.includes(url);
    }
  }
}
