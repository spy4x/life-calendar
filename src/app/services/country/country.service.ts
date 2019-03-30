import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CountryService {
  country: string = null;

  constructor(private http: HttpClient) { }

  username = 'dmitriy.kolesov';

  async get(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.country) {
          resolve(this.country);
        }
        const response = await this.http.get<{ country: string }>('http://ip-api.com/json').toPromise();
        if (response.country) {
          this.country = response.country;
          resolve(this.country);
         }
        if (navigator.geolocation) {

          await
            navigator.geolocation.getCurrentPosition(async (position) => {
              const data: any = await this.http.get('http://api.geonames.org/countryCode', {
                params: {
                  lat: `${position.coords.latitude}`,
                  lng: `${position.coords.longitude}`,
                  type: 'JSON',
                  username: this.username,
                },
              })
                .toPromise();
              this.country = data.countryName;
              resolve(this.country);
            });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
