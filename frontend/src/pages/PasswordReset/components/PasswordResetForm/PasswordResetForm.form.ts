import { withFormik, FormikErrors } from 'formik';

export interface FormValues {
  token: string;
  password: string;
}

export type FormOutsideProps = {
  token: string;
  email: string;
  loading: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
};

const withPasswordResetForm = withFormik<FormOutsideProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      token: props.token,
      password: '',
    };
  },
  mapPropsToErrors: () => {
    return {
      password: 'auth.errors.required',
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.password) {
      errors.password = 'auth.errors.required';
    }
    if (values.password && values.password.length < 6) {
      errors.password = 'auth.errors.required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    await props.onSubmit(values);
    setSubmitting(false);
  },
});

export default withPasswordResetForm;
