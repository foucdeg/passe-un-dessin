import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';
import InnerForm from './ClassicAccountCreationForm';
import { AsyncFnReturn } from 'react-use/lib/useAsync';
import { FnReturningPromise } from 'react-use/lib/util';

export interface OutsideProps {
  createAccount: AsyncFnReturn<FnReturningPromise>;
}
// Shape of form values
export interface FormValues {
  email: string;
  password: string;
}

const ClassicAccountCreationForm = withFormik<OutsideProps, FormValues>({
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

  handleSubmit: (values, { props }) => {
    const [, doCreateAccount] = props.createAccount;
    doCreateAccount({ email: values.email, password: values.password });
  },
})(InnerForm);

export default ClassicAccountCreationForm;
