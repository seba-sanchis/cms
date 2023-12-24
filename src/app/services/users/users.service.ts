import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/user`);
  }

  calculateQuantities(users: User[]): any[] {
    return users.map((user) => ({
      amountOfOrders: user.purchases?.length || 0,
      totalReceived: user.purchases?.reduce(
        (sum, purchase) => sum + (purchase.transaction?.received || 0),
        0
      ),
    }));
  }
}
