import React from 'react';
import { withFormik, FormikErrors } from 'formik';
import { isValidEmail } from 'services/utils';
import { AsyncFnReturn } from 'react-use/lib/useAsync';
import { useLogin } from 'redux/Player/hooks';
import InnerForm from './ClassicLoginForm';

interface OutsideProps {
  onLoggedIn?: () => void;
}

export type FormOutsideProps = OutsideProps & {
  login: AsyncFnReturn<(email: string, password: string) => Promise<void>>;
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
    const result = await doLogin(values.email, values.password);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any) instanceof Error) {
      return;
    }
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
