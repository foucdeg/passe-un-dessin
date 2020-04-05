import React, { useState } from 'react';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Header,
  HelpParagraph,
  StartButton,
  ButtonRow,
  Credits,
  RightSideTitle,
  HelpLink,
} from './Home.style';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useCreateRoom } from 'redux/Room/hooks';
import { useHistory, useLocation } from 'react-router';
import Button from 'components/Button';
import SecondaryButton from 'components/SecondaryButton';

const Home: React.FunctionComponent = () => {
  const [, doCreateRoom] = useCreateRoom();
  const player = useSelector((state: RootState) => state.player.player);
  const history = useHistory();
  const [secondStep, setSecondStep] = useState<boolean>(false);
  const location = useLocation();

  if (!location.pathname.match(/\/(room\/[^/]+)?$/)) return null;

  return (
    <>
      <LeftSide>
        <LeftSideTitle>Passe un dessin</LeftSideTitle>
        <Subtitle>Tu ne sais pas dessiner ? On va rire.</Subtitle>
        {!secondStep && (
          <>
            <Header>Comment jouer ?</Header>
            <HelpParagraph>
              Dans ce jeu, tes amis et toi allez dessiner des mots et expressions et essayer de
              deviner ce que le précédent a dessiné. Chaque mot initial, choisi par un joueur, va
              faire le tour du groupe, transformé au fur et à mesure qu'il a été dessiné puis
              deviné. A la fin, on relit les carnets de dessin pour voir qui dessine le moins mal !
            </HelpParagraph>
            <StartButton onClick={() => setSecondStep(true)}>Commencer</StartButton>
          </>
        )}
        {secondStep && (
          <>
            {player && <HelpParagraph>Te revoilà, {player.name} !</HelpParagraph>}
            <ButtonRow>
              <SecondaryButton>Rejoindre une partie</SecondaryButton>
              <Button onClick={() => doCreateRoom(history)}>Lancer une partie</Button>
            </ButtonRow>
            <HelpLink onClick={() => setSecondStep(false)}>Retourner aux règles du jeu</HelpLink>
          </>
        )}
      </LeftSide>
      <RightSide>
        <RightSideTitle>Passe un Dessin</RightSideTitle>
        <Credits>github: foucdeg/passe-un-dessin</Credits>
      </RightSide>
    </>
  );
};

export default Home;
