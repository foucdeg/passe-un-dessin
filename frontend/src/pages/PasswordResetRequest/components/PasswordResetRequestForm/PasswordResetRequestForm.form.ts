import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';

export interface FormValues {
  email: string;
}

export type FormOutsideProps = {
  loading: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
};

const withPasswordResetRequestForm = withFormik<FormOutsideProps, FormValues>({
  mapPropsToValues: () => {
    return {
      email: '',
    };
  },
  mapPropsToErrors: () => {
    return {
      email: 'auth.errors.required',
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = 'auth.errors.required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'auth.errors.invalidEmail';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    await props.onSubmit(values);
    setSubmitting(false);
  },
});

export default withPasswordResetRequestForm;
