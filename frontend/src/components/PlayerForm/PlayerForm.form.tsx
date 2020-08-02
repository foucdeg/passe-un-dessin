import React from 'react';

import { withFormik, FormikErrors } from 'formik';
import { NoProps } from 'services/utils';
import InnerForm from './PlayerForm';
import { Player } from 'redux/Player/types';
import { useEditPlayer } from 'redux/Player/hooks';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';

export interface OutsideProps {
  player: Player;
  onSubmit: (player: Player) => Promise<void>;
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
    if (!values.name) {
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
    await onSubmit({ ...player, name, color });
    setSubmitting(false);
  },
})(InnerForm);

const OuterPlayerForm: React.FC<NoProps> = () => {
  const player = useSelector(selectPlayer);
  const doEditPlayer = useEditPlayer();

  if (!player) return null;

  return <PlayerForm player={player} onSubmit={doEditPlayer} />;
};

export default OuterPlayerForm;
