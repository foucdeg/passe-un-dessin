import React from 'react';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Header,
  HelpParagraph,
  StartButton,
  Credits,
  RightSideTitle,
  PlayerLine,
} from './Home.style';
import { useCreateRoom } from 'redux/Room/hooks';
import { useLocation } from 'react-router';
import PlayerChip from 'atoms/PlayerChip';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';

const Home: React.FunctionComponent = () => {
  const doCreateRoom = useCreateRoom();
  const player = useSelector(selectPlayer);
  const location = useLocation();

  if (!location.pathname.match(/\/(room\/[^/]+)?$/)) return null;

  return (
    <>
      <LeftSide>
        <LeftSideTitle>Passe un dessin</LeftSideTitle>
        <Subtitle>Tu ne sais pas dessiner ? On va rire.</Subtitle>
        {player && (
          <PlayerLine>
            Bienvenue,&nbsp;<PlayerChip color={player.color}>{player.name}</PlayerChip> !
          </PlayerLine>
        )}
        <Header>Comment jouer ?</Header>
        <HelpParagraph>
          Dans ce jeu, tes amis et toi allez dessiner des mots et expressions et essayer de deviner
          ce que le précédent a dessiné. Chaque mot initial, choisi par un joueur, va faire le tour
          du groupe, transformé au fur et à mesure qu'il a été dessiné puis deviné. A la fin, on
          relit les carnets de dessin pour voir qui dessine le moins mal !
        </HelpParagraph>
        <StartButton onClick={doCreateRoom}>Lancer une partie</StartButton>
        <HelpParagraph>
          Pour rejoindre une partie existante, l'organisateur doit t'envoyer le lien.
        </HelpParagraph>
      </LeftSide>
      <RightSide>
        <RightSideTitle>Passe un Dessin</RightSideTitle>
        <Credits>Michèle Ruaud \ Foucauld Degeorges</Credits>
      </RightSide>
    </>
  );
};

export default Home;
