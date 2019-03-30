import { Injectable } from '@angular/core';
import { User } from '../../types/user.interface';
import { BehaviorSubject } from 'rxjs';

const localStorageKey = 'user';
const defaultUser: User = {
  isNew: true,
  country: null,
  yearOfBirth: 0,
  yearsToLife: 0,
  age: 0,
  ageOfDeath: 0,
  gender: 'male',
};

@Injectable()
export class UserDataService {
  user$ = new BehaviorSubject<User>(this.getFromLocalStorage());

  set(user: User): void {
    this.user$.next(user);
    this.saveToLocalStorage(user);
  }

  patch(user: Partial<User>): void {
    const newValue = Object.assign({}, this.user$.value, user);
    this.user$.next(newValue);
    this.saveToLocalStorage(newValue);
  }

  private getFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem(localStorageKey)) || defaultUser;
  }

  private saveToLocalStorage(user: User): void {
    localStorage.setItem(localStorageKey, JSON.stringify(user));
  }
}
