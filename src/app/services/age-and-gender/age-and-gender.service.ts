import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

type Gender = 'male' | 'female';

export interface AgeAndGender {
  age: number;
  gender: Gender;
}

@Injectable()
export class AgeAndGenderService {
  age: number = null;
  gender: Gender = null;

  get(base64: string): Promise<AgeAndGender> {
    return new Promise((resolve, reject) => {
      if (this.age && this.gender) {
        resolve({ age: this.age, gender: this.gender });
      }
      try {
        const data = { image: base64.split(',')[1] };

        const xmlHttp = new XMLHttpRequest();
        let result;

        xmlHttp.onreadystatechange = () => {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            const response: any = JSON.parse(xmlHttp.responseText);
            if (response && response.objects && response.objects.length) {
              const faces = response.objects.filter(obj => obj.type === 'face');
              if (faces.length) {
                result = faces[0].attributes;
              }
            }

            if (result && result.age && result.gender) {
              this.age = result.age;
              this.gender = result.gender;
              resolve(this.getResult());
            } else {
              reject(new Error('Age and gender can not be recognized'));
            }
          }
        };

        xmlHttp.open('POST', 'https://dev.sighthoundapi.com/v1/detections?type=face,person&faceOption=age,gender');
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.setRequestHeader('X-Access-Token', environment.sighthoundCloudToken);
        xmlHttp.send(JSON.stringify(data));
      } catch (e) {
        reject(e);
      }
    });
  }

  private getResult() {
    return { age: this.age, gender: this.gender };
  }

  genderStr(): string {
    if (!this.gender) {
      return undefined;
    }
    if (this.gender === 'male') {
      return 'man';
    } else {
      return 'woman';
    }
  }
}
