import { Component } from '@angular/core';
import { ContentDetailsService } from '../../services/content-details/content-details.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Content } from '../../models/content.model';
import { Observer } from 'rxjs';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-content-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './content-details.component.html',
  styleUrl: './content-details.component.scss',
})
export class ContentDetailsComponent {
  constructor(
    private contentDetailsService: ContentDetailsService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  contentForm = new FormGroup({
    title: new FormControl(''),
    subtitle: new FormControl(''),
    image: new FormControl(''),
    url: new FormControl(''),
    tag: new FormControl(''),
  });

  selectedFile: File | null = null;

  ngOnInit() {
    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Fetch the content using the retrieved 'id'
      this.fetchContent(id);
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  private fetchContent(id: string): void {
    this.contentDetailsService.getContent(id).subscribe((data) => {
      // Set form values based on the fetched content
      this.contentForm.patchValue(data);
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    // Retrieve the updated product data from the form
    const updatedContent: Content = this.contentForm.value as Content;
    const updatedFile: File = this.selectedFile as File;

    // Retrieve the 'id' from the route parameters
    this.route.params.subscribe((params) => {
      const id = params['id'];

      // Call the productDetailsService to update the product
      const observer: Observer<Content> = {
        next: (updatedContent) => {
          // Redirect to the previous page
          this.location.back();
        },
        error: (error) => {
          // Handle error, e.g., show an error message
          console.error('Error updating product:', error);
        },
        complete: () => {
          // Cleanup logic
        },
      };

      this.contentDetailsService
        .updateContent(id, updatedContent, updatedFile)
        .subscribe(observer);
    });
  }
}
