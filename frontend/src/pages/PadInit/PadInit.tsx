import React, { useState, useCallback } from 'react';
import { RootState } from 'redux/types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import TextInput from 'components/TextInput';
import {
  useServerSentEvent,
  SERVER_EVENT_TYPES,
  RoundStartsEventType,
} from 'services/networking/server-events';
import { useSavePad } from 'redux/Game/hooks';
import { startRounds } from 'redux/Game';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);
  const [sentence, setSentence] = useState<string>('');
  const history = useHistory();
  const [, doSavePad] = useSavePad();
  const dispatch = useDispatch();

  const pad = game?.pads.find(pad => pad.uuid === padId);

  const eventCallback = useCallback(
    ({ round_number: roundNumber }: RoundStartsEventType) => {
      if (!game || !pad) return;

      dispatch(startRounds({}));

      const stepForRound = pad.steps[roundNumber];
      history.push(`/game/${game.uuid}/step/${stepForRound.uuid}`);
    },
    [dispatch, game, history, pad],
  );

  useServerSentEvent<RoundStartsEventType>(
    `game-${game?.uuid}`,
    SERVER_EVENT_TYPES.ROUND_STARTS,
    eventCallback,
  );

  if (!game) return null;
  if (!pad) return null;

  return (
    <>
      <p>Bienvenue sur le pad {pad.uuid} !</p>
      <p>Etape d'initialisation. Choisis un mot ou une phrase : </p>
      {pad.sentence ? (
        <p>{pad.sentence}</p>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            doSavePad(pad, sentence);
          }}
        >
          <TextInput type="text" value={sentence} onChange={e => setSentence(e.target.value)} />
        </form>
      )}
    </>
  );
};

export default PadInit;
