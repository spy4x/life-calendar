export interface User {
  isNew: boolean;
  shouldPlayVoice: boolean;
  country: string;
  yearOfBirth: number;
  lifeExpectancy: number;
  yearOfDeath: number;
  age: number;
  yearsLeft: number;
  gender: string;
  percentageLivedSoFar: number;
  activeLifeGap: number;
}
