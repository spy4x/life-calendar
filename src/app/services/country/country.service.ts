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
    try {
      let response: any;
      const currentPosition: any = await new Promise(async (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( (position) => {
            resolve(position);
          }, error => {
            resolve(null);
          });
        } else {
          resolve(null);
        }
      });
      if (currentPosition) {
        const q = `${currentPosition.coords.latitude}+${currentPosition.coords.longitude}`;
        const apiUrl = `https://nominatim.openstreetmap.org/reverse`;
        response = await this.http.get(apiUrl, {
          params: {
            format: 'json',
            lat: currentPosition.coords.latitude,
            lon: currentPosition.coords.longitude,
            'accept-language': 'en'
          },
        })
          .toPromise();
        if (response && response.address) {
          return this.country = response.address.country;
        }
      }

      // response = await this.http.get<{ country: string }>('http://ip-api.com/json').toPromise();
      // if (response && response.country) {
      //   console.log(2);
      //   return this.country = response.country;
      // }
      return this.country = null;
    } catch (e) {
    return null;
  }
}
}
