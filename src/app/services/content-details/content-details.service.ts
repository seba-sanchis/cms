import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap } from 'rxjs';
import { Content } from '../../models/content.model';

@Injectable({
  providedIn: 'root',
})
export class ContentDetailsService {
  private apiUrl = environment.baseUrl;
  private imageUrl = environment.awsS3;

  constructor(private http: HttpClient) {}

  getContent(id: string): Observable<Content> {
    return this.http.get<Content>(`${this.apiUrl}/api/content/${id}`);
  }

  updateContent(id: string, content: Content, file: File): Observable<Content> {

    // If there is no file, update the content without making a request to AWS
    if (!file) {
      const contentData = { ...content };

      return this.http.patch<Content>(`${this.apiUrl}/api/content/${id}`, contentData);
    }
  
    // Create a new FormData and append the file with the new name
    const formData = new FormData();

    // Replace non-alphanumeric characters with hyphens and all characters converted to lowercase
    const slug = content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const imageName = `${id}_${slug}.png`;

    // Append the 'file' and 'id' to the formData
    formData.append('file', file, imageName);

    // Construct the image URL and update the content
    const image = `${this.imageUrl}/${imageName}`;

    const contentData = { ...content, image };

    // Make the first HTTP POST request
    return this.http
      .patch<Content>(`${this.apiUrl}/api/content/${id}`, contentData)
      .pipe(
        switchMap(() => {
          // If the first request is successful, make the second HTTP PATCH request
          return this.http.post<Content>(`${this.apiUrl}/api/aws`, formData);
        }),
        catchError((error) => {
          // Handle errors from the first or second request
          console.error('Error:', error);
          throw error; // Rethrow the error to propagate it to the subscriber
        })
      );
  }
}
