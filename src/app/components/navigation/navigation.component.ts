import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  links = [
    {
      name: 'Dashboard',
      url: '/',
    },
    {
      name: 'Orders',
      url: '/orders',
    },
    {
      name: 'Products',
      url: '/products',
    },
    {
      name: 'Customers',
      url: '/customers',
    },
    {
      name: 'Content',
      url: '/content',
    },
  ];
}
