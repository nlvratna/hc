export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
export const date = new Date();
export interface healthRecord {
  age: typeof date;
  gender: Gender;
  familyHistory: string[];
  medication: medication[];
}
export interface healthRecordInput {
  details: healthRecord;
  submitted: boolean;
  err: any;
}

export interface medication {
  name: string;
  prescription?: string;
  reportedAt: typeof date;
}
