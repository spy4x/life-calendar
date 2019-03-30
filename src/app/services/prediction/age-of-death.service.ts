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
    if (age) {
      if (sex) {
        if (sex === 'male') {
          this.ageOfDeath = parseFloat(age.male);
        } else {
          this.ageOfDeath = parseFloat(age.female);
        }
      } else {
        this.ageOfDeath = parseFloat(age.avg);
      }
    } else {
      this.ageOfDeath = avgAgeOfDeath;
    }
    return this.ageOfDeath;
  }
}
