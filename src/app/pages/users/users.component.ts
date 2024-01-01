import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: User[] = [];
  userQuantities: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
    this.usersService.getUsers().subscribe((data) => {
      this.users = data;
      this.calculateQuantities();
    });
  }

  private calculateQuantities(): void {
    this.userQuantities = this.usersService.calculateQuantities(this.users);
  }
}
