import { Component } from '@angular/core';
import { Content } from '../../models/content.model';
import { ContentService } from '../../services/content/content.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  content: Content[] = [];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.contentService.getContent().subscribe((data) => {
      this.content = this.contentService.updateDateFormats(data);
    });
  }
}
