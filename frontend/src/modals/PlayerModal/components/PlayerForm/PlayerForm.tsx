import React from 'react';
import { FormikProps, Field } from 'formik';
import InputLoader from 'atoms/InputLoader';
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
  StyledAvatar,
} from './PlayerForm.style';

const InnerPlayerForm: React.FC<OutsideProps & FormikProps<FormValues>> = ({
  touched,
  errors,
  values,
  player,
  isEditing,
  setIsEditing,
  openAvatarDrawing,
  isSubmitting,
}) => {
  if (!isEditing)
    return (
      <Row>
        <StyledAvatar player={player} onClick={openAvatarDrawing} editOnHover />
        <Square color={player.color} />
        <StyledNonInput>{player.name}</StyledNonInput>
        <StyledEditIcon onClick={() => setIsEditing(true)} />
      </Row>
    );

  return (
    <StyledForm>
      <StyledAvatar player={player} onClick={openAvatarDrawing} editOnHover />
      <Square color={values.color} />
      <Field
        as={StyledTextInput}
        maxLength={30}
        type="string"
        name="name"
        hasError={touched.name && errors.name}
        autoFocus
        adornment={isSubmitting && <InputLoader />}
      />
      <AirButton type="submit">
        <StyledCheckIcon />
      </AirButton>
    </StyledForm>
  );
};

export default InnerPlayerForm;
