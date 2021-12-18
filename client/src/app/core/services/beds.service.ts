import { Injectable } from '@angular/core';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root',
})
export class BedsService {
  constructor(private apiService: ApiService) {}

  getBeds() {
    return this.apiService.get('/news/all');
  }

  postBeds(data: any) {
    return this.apiService.post('/beds/add', { news: data });
  }
}
