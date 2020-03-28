import { IntlShape } from 'react-intl';

const intlShape = {
  formatDate: jest.fn(),
  formatTime: jest.fn(),
  formatRelative: jest.fn(),
  formatNumber: jest.fn(),
  formatPlural: jest.fn(),
  formatMessage: jest.fn(),
  formatHTMLMessage: jest.fn(),
};
const castInjectedIntlShape = (intlShape as unknown) as IntlShape;

export default castInjectedIntlShape;
