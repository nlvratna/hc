export enum Gender {
  Male = "male",
  Female = "female",
}
export const date: Date = new Date();
export interface healthRecord {
  details: {
    age: typeof date;
    gender: Gender;
    familyHistory: string[];
    medication: medication[];
  };
  submitted: boolean;
  err: any;
}

export interface medication {
  name: string;
  prescription?: string;
  reportedAt: typeof date;
}
