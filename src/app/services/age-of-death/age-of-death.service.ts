import { Injectable } from '@angular/core';
import { AGES } from '../../../data/ages-wiki';

const avgAgeOfDeath = 66.9;

@Injectable()
export class AgeOfDeathService {
  ageOfDeath: number = null;

  async get(country: string, sex: string): Promise<number> {
    if (this.ageOfDeath) {
      return this.ageOfDeath;
    }
    const age = AGES[country];
    let ageOfDeath;
    if (age) {
      if (sex) {
        if (sex === 'male') {
          ageOfDeath = parseFloat(age.male);
        } else {
          ageOfDeath = parseFloat(age.female);
        }
      } else {
        ageOfDeath = parseFloat(age.avg);
      }
    } else {
      ageOfDeath = avgAgeOfDeath;
    }
    this.ageOfDeath = Math.floor(ageOfDeath);
    return this.ageOfDeath;
  }
}
