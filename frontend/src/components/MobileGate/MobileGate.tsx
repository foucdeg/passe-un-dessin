import React, { useState } from 'react';

import {
  MobileGateBackground,
  LaptopTablet,
  StyledForm,
  InputArrow,
  StyledHeader,
} from './MobileGate.style';
import { FormattedMessage, useIntl } from 'react-intl';
import FieldLabel from 'atoms/FieldLabel';
import TextInput from 'components/TextInput';
import { Spacer } from 'atoms/Spacer';

interface Props {
  children: React.ReactNode;
}

const BREAKPOINT = 900;

const MobileGate: React.FC<Props> = ({ children }) => {
  const intl = useIntl();
  const [email, setEmail] = useState<string>('');
  const isMobile = window.innerWidth <= BREAKPOINT;

  const sendEmail = () => {
    if (email) {
      const emailSubject = encodeURIComponent(
        intl.formatMessage({ id: 'mobileGate.emailSubject' }),
      );
      const emailBody = encodeURIComponent(
        intl.formatMessage({ id: 'mobileGate.emailBody' }, { link: window.location.href }),
      );
      window.open(`mailto:${email}?subject=${emailSubject}&body=${emailBody}`);
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileGateBackground>
          <StyledHeader>
            <FormattedMessage id="mobileGate.bigFingers" />
          </StyledHeader>
          <p>
            <FormattedMessage id="mobileGate.laptopOrTablet" />
          </p>
          <Spacer />
          <LaptopTablet />
          <Spacer />
          <StyledForm
            onSubmit={e => {
              e.preventDefault();
              sendEmail();
            }}
            action="#"
          >
            <FieldLabel>
              <FormattedMessage id="mobileGate.sendEmail" />
            </FieldLabel>
            <TextInput
              type="email"
              placeholder={intl.formatMessage({ id: 'mobileGate.emailExample' })}
              value={email}
              onChange={e => setEmail(e.target.value)}
              adornment={<InputArrow onClick={sendEmail} />}
            />
          </StyledForm>
        </MobileGateBackground>
      ) : (
        children
      )}
    </>
  );
};

export default MobileGate;
