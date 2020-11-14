import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import Header3 from 'atoms/Header3';
import { colorPalette } from 'stylesheet';

export const Header = styled(Header3)`
  color: ${colorPalette.orange};
  margin-bottom: 32px;
  align-self: flex-start;
`;

Header.displayName = 'Header';

export const RuleSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

RuleSection.displayName = 'RuleSection';

export const Rule = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 16px;
`;
Rule.displayName = 'Rule';

export const RuleNumberBackground = styled.div<{ background: string }>`
  background: url(${(props) => props.background});
  background-size: contain;
  height: 40px;
  width: 40px;
  box-shadow: 0 4px 4px ${colorPalette.blackTransparent};
  margin-right: 16px;
  border-radius: 20px;
  border: 0;
  flex-shrink: 0;
  position: relative;
`;

RuleNumberBackground.displayName = 'RuleNumberBackground';

export const RuleNumber = styled(Header2)`
  position: absolute;
  color: ${colorPalette.white};
  left: 13px;
  bottom: 7px;
`;

RuleNumber.displayName = 'RuleNumber';

export const RuleParagraph = styled.p`
  flex-grow: 1;
`;

RuleParagraph.displayName = 'RuleParagraph';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
`;
ButtonRow.displayName = 'ButtonRow';
