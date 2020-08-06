import React from 'react';
import { FormikProps, Field } from 'formik';
import { FormValues, OutsideProps } from './PlayerForm.form';
import {
  Square,
  StyledEditIcon,
  StyledCheckIcon,
  Row,
  StyledForm,
  StyledNonInput,
  StyledTextInput,
  AirButton,
} from './PlayerForm.style';

const InnerPlayerForm: React.FC<OutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  values,
  player,
  isEditing,
  setIsEditing,
}) => {
  if (!isEditing)
    return (
      <Row>
        <Square color={player.color} />
        <StyledNonInput>{player.name}</StyledNonInput>
        <StyledEditIcon onClick={() => setIsEditing(true)} />
      </Row>
    );

  return (
    <StyledForm>
      <Square color={values.color} />
      <Field
        as={StyledTextInput}
        type="string"
        name="name"
        hasError={touched.name && errors.name}
        autoFocus
      />
      <AirButton type="submit">
        <StyledCheckIcon />
      </AirButton>
    </StyledForm>
  );
};

export default InnerPlayerForm;
