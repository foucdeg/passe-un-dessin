import React, { useState } from 'react';

import { withFormik, FormikErrors } from 'formik';
import { Player } from 'redux/Player/types';
import { useEditPlayer } from 'redux/Player/hooks';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import InnerForm from './PlayerForm';

export interface OutsideProps {
  player: Player;
  onSubmit: (player: Partial<Player>) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  openAvatarDrawing: () => void;
}

export interface OwnProps {
  openAvatarDrawing: () => void;
}
// Shape of form values
export interface FormValues {
  name: string;
  color: string;
}

const PlayerForm = withFormik<OutsideProps, FormValues>({
  mapPropsToValues: ({ player }) => {
    return {
      name: player.name,
      color: player.color,
    };
  },
  validate: (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name.trim()) {
      errors.name = 'playerModal.errors.required';
    }
    if (!values.color) {
      errors.color = 'playerModal.errors.required';
    }
    return errors;
  },
  validateOnChange: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    const { onSubmit, player } = props;
    const { name, color } = values;
    await onSubmit({ uuid: player.uuid, name: name.trim(), color });
    setSubmitting(false);
    props.setIsEditing(false);
  },
})(InnerForm);

const OuterPlayerForm: React.FC<OwnProps> = ({ openAvatarDrawing }) => {
  const player = useSelector(selectPlayer);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const doEditPlayer = useEditPlayer();

  if (!player) return null;

  return (
    <PlayerForm
      openAvatarDrawing={openAvatarDrawing}
      player={player}
      onSubmit={doEditPlayer}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default OuterPlayerForm;
