import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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
    return this.http.patch<User>(`${this.apiUrl}/api/user/${id}`, { ...user, _id: id });
  }
}
