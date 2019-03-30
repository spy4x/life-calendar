import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CountryService {
  country: string = null;

  constructor(private http: HttpClient) { }

  async get(): Promise<string> {
    if (this.country) {
      return this.country;
    }
    const response = await this.http.get<{country: string}>('http://ip-api.com/json').toPromise();
    return this.country = response.country;
  }
}
