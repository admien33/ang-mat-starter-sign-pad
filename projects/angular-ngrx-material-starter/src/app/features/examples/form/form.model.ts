export interface Form {
  autosave: boolean;
  username: string;
  password: string;
  email: string;
  description: string;
  requestGift: boolean;
  birthday: Date;
  rating: number;
  signatureField1: string;
}

export interface FormState {
  form: Form;
}
