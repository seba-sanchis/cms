import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { User } from '../../models/user.model';
import { Location } from '@angular/common';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  constructor(
    private userDetailsService: UserDetailsService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dni: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl(''),
    region: new FormControl(''),
    location: new FormControl(''),
    address: new FormControl(''),
    zip: new FormControl(''),
    areaCode: new FormControl(''),
    phone: new FormControl(''),
  });

  ngOnInit() {
    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Fetch the user using the retrieved 'id'
      this.fetchUser(id);
    });
  }

  private fetchUser(id: string): void {
    this.userDetailsService.getUser(id).subscribe((data) => {
      // Format the date to 'YYYY-MM-DD'
      const formattedBirthday = data.privacy.birthday
        ? new Date(data.privacy.birthday).toISOString().split('T')[0]
        : '';

      // Set form values based on the fetched product
      this.userForm.setValue({
        firstName: data.privacy.firstName || null,
        lastName: data.privacy.lastName || null,
        dni: data.privacy.dni || null,
        email: data.account.email || null,
        birthday: formattedBirthday || null,
        region: data.shipping.region || null,
        location: data.shipping.location || null,
        address: data.shipping.address || null,
        zip: data.shipping.zip || null,
        areaCode: data.shipping.areaCode || null,
        phone: data.shipping.phone || null,
      });
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    // Retrieve the updated user data from the form
    const updatedUserData: User = this.userForm.value as User;

    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Call the userDetailsService to update the user
      const observer: Observer<User> = {
        next: (updatedUser) => {
          // Redirect to the previous page
          this.location.back();
        },
        error: (error) => {
          // Handle error, e.g., show an error message
          console.error('Error updating user:', error);
        },
        complete: () => {
          // Cleanup logic
        },
      };

      this.userDetailsService
        .updateUser(id, updatedUserData)
        .subscribe(observer);
    });
  }
}
