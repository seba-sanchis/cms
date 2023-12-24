import { TestBed } from '@angular/core/testing';

import { ContentDetailsService } from './content-details.service';

describe('ContentDetailsService', () => {
  let service: ContentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
