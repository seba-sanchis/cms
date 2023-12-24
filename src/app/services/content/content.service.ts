import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Content } from '../../models/content.model';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getContent(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.apiUrl}/api/content`);
  }

  updateDateFormats(content: Content[]): Content[] {
    const datePipe = new DatePipe('en-US');

    return content.map((item) => {
      if (item.lastUpdated) {
        item.lastUpdated = this.customFormatDate(item.lastUpdated, datePipe);
      }
      return item;
    });
  }

  private customFormatDate(
    dateString: string | null,
    datePipe: DatePipe
  ): string | null {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);

    // Use datePipe to format the date
    let formattedDate = datePipe.transform(date, 'MMM d, y') || '';

    return formattedDate;
  }
}
