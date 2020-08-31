import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const url = "http://192.168.1.3:2859/test-text/";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private http : HttpClient) { }

  getTestText() {
    return this.http.get(url);
  }
}
