import React from 'react';
import { FormikProps, Form, Field } from 'formik';
import { FormValues, OutsideProps } from './PlayerForm.form';
import FieldLabel from 'atoms/FieldLabel';
import { FormattedMessage } from 'react-intl';
import TextInput from 'components/TextInput';
import { PLAYER_COLORS } from './PlayerForm.style';

const InnerPlayerForm: React.FC<OutsideProps & FormikProps<FormValues>> = ({ touched, errors }) => (
  <Form>
    <FieldLabel>
      <FormattedMessage id="playerModal.playerName" />
    </FieldLabel>
    <Field as={TextInput} type="string" name="name" hasError={touched.name && errors.name} />
    <FieldLabel>
      <FormattedMessage id="playerModal.playerColor" />
    </FieldLabel>
    <Field as="select" name="color">
      {Object.entries(PLAYER_COLORS).map(([colorHash, colorName]) => (
        <FormattedMessage key={colorHash} id={`playerModal.colors.${colorName}`}>
          {(message: string) => (
            <option value={colorHash} color={colorHash}>
              {message}
            </option>
          )}
        </FormattedMessage>
      ))}
    </Field>
  </Form>
);

export default InnerPlayerForm;
