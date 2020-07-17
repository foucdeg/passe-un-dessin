import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';
import InnerForm from './ClassicLoginForm';

// Shape of form values
export interface FormValues {
  email: string;
  password: string;
}

/* eslint-disable-next-line @typescript-eslint/ban-types */
const ClassicLoginForm = withFormik<{}, FormValues>({
  mapPropsToValues: () => {
    return {
      email: '',
      password: '',
    };
  },

  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: (values) => {
    // do submitting things
  },
})(InnerForm);

export default ClassicLoginForm;
