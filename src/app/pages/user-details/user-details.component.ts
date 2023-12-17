import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserDetailsService } from '../../services/user-details/user-details.service';
import { User } from '../../models/user.model';

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
    private route: ActivatedRoute
  ) {}

  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dni: new FormControl(0),
    birthday: new FormControl(''),
    email: new FormControl(''),
    region: new FormControl(''),
    location: new FormControl(''),
    address: new FormControl(''),
    postcode: new FormControl(0),
    areaCode: new FormControl(0),
    phone: new FormControl(0),
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
      const formattedBirthday = data.birthday
        ? new Date(data.birthday).toISOString().split('T')[0]
        : '';

      // Set form values based on the fetched product
      this.userForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        email: data.email,
        birthday: formattedBirthday,
        region: data.region,
        location: data.location,
        address: data.address,
        postcode: data.postcode,
        areaCode: data.areaCode,
        phone: data.phone,
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
      this.userDetailsService.updateUser(id, updatedUserData).subscribe(
        (updatedUser) => {
          // Handle success, e.g., show a success message
          console.log('User updated successfully:', updatedUser);
        },
        (error) => {
          // Handle error, e.g., show an error message
          console.error('Error updating user:', error);
        }
      );
    });
  }
}
