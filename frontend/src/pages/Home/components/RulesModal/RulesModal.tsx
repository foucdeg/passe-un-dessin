import Modal from 'components/Modal';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ruleBackgrounds from 'assets/rule-backgrounds';

import Button from 'atoms/Button';
import {
  Header,
  RuleSection,
  Rule,
  RuleNumberBackground,
  RuleNumber,
  RuleParagraph,
  ButtonRow,
} from './RulesModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Header>
      <FormattedMessage id="home.howToPlay" />
    </Header>
    <RuleSection>
      {ruleBackgrounds.map((ruleBackground, index) => (
        <Rule key={ruleBackground}>
          <RuleNumberBackground background={ruleBackground}>
            <RuleNumber>{index + 1}</RuleNumber>
          </RuleNumberBackground>

          <RuleParagraph>
            <FormattedMessage
              id={`home.rules.${index}`}
              values={{ strong: (...chunks: string[]) => <strong>{chunks}</strong> }}
            />
          </RuleParagraph>
        </Rule>
      ))}
    </RuleSection>
    <ButtonRow>
      <Button onClick={onClose}>
        <FormattedMessage id="home.rulesUnderstood" />
      </Button>
    </ButtonRow>
  </Modal>
);

export default RulesModal;
