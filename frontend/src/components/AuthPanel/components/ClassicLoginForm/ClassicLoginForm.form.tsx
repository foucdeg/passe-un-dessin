import React from 'react';
import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';
import InnerForm from './ClassicLoginForm';
import { AsyncFnReturn } from 'react-use/lib/useAsync';
import { FnReturningPromise } from 'react-use/lib/util';
import { useLogin } from 'redux/Player/hooks';

interface OutsideProps {
  onLoggedIn?: () => void;
}

export type FormOutsideProps = OutsideProps & {
  login: AsyncFnReturn<FnReturningPromise>;
};

// Shape of form values
export interface FormValues {
  email: string;
  password: string;
}

const ClassicLoginForm = withFormik<FormOutsideProps, FormValues>({
  mapPropsToValues: () => {
    return {
      email: '',
      password: '',
    };
  },
  mapPropsToErrors: () => {
    return {
      email: 'auth.errors.required',
      password: 'auth.errors.required',
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = 'auth.errors.required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'auth.errors.invalidEmail';
    }
    if (!values.password) {
      errors.password = 'auth.errors.required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    const [, doLogin] = props.login;
    await doLogin({ email: values.email, password: values.password });
    setSubmitting(false);
    if (props.onLoggedIn) {
      props.onLoggedIn();
    }
  },
})(InnerForm);

const OuterClassicLoginForm: React.FC<OutsideProps> = ({ onLoggedIn }) => {
  const login = useLogin();

  return <ClassicLoginForm onLoggedIn={onLoggedIn} login={login} />;
};

export default OuterClassicLoginForm;
