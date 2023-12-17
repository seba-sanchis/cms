import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    // Example headers, customize as needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      headers,
      body: JSON.stringify(user),
    };

    return this.http.request<User>(
      'PATCH',
      `${this.apiUrl}/api/user/${id}`,
      options
    );
  }
}
