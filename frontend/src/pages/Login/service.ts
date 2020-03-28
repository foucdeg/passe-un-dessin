import { FormikErrors } from 'formik';

export interface FormValues {
  email: string;
  password: string;
}

export const validateForm = (values: FormValues): FormikErrors<FormValues> => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.email) {
    errors.email = 'Email required';
  }
  return errors;
};

export const initialValues: FormValues = {
  email: '',
  password: '',
};
