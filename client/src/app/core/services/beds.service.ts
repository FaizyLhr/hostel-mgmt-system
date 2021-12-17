import { Injectable } from '@angular/core';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root'
})
export class BedsService {

  constructor(private apiService: ApiService) { }

  getNews() {
    return this.apiService.get('/news/all');
  }

  postNews(data: any){
    return this.apiService.post('/news/addNews', {news: data});
  }
}
