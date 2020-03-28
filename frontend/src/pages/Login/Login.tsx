import { Field, Formik } from 'formik';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import InputRow from 'components/InputRow';
import { LoginButton, LoginContainer, LoginForm, Logo, Title } from './Login.style';
import { initialValues, validateForm } from './service';

import logo from 'assets/logo.png';
import { useLogin } from 'redux/Login/hooks';

const InnerLoginForm: React.FC = () => {
  const intl = useIntl();
  const [{ loading }, login] = useLogin();
  return (
    <LoginContainer>
      <Logo alt="Forge logo" src={logo} />
      <Title>
        <FormattedMessage id="login.title" />
      </Title>
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={(values, { setSubmitting }) => {
          login(values);
          setSubmitting(false);
        }}
      >
        {props => (
          <LoginForm>
            <Field
              type="text"
              name="email"
              label={<FormattedMessage id="login.email" />}
              placeholder={intl.formatMessage({ id: 'login.email-placeholder' })}
              component={InputRow}
              error={props.touched.email && props.errors.email}
            />
            <Field
              type="password"
              name="password"
              label={<FormattedMessage id="login.password" />}
              placeholder={intl.formatMessage({ id: 'login.password-placeholder' })}
              component={InputRow}
              error={props.touched.password && props.errors.password}
            />
            <LoginButton type="submit" disabled={props.isSubmitting || loading}>
              <FormattedMessage id="login.login-button" />
            </LoginButton>
          </LoginForm>
        )}
      </Formik>
    </LoginContainer>
  );
};

export default InnerLoginForm;
