import { mount, ReactWrapper } from 'enzyme';
import React from 'react';

import Avatar from '../Avatar';
import { Input } from '../Avatar.style';
import configureStore from 'redux/store';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import enMessages from 'translations/en.json';
import flattenMessages from 'services/i18n/intl';
import * as avatartHooks from 'redux/Avatar/hooks';

jest.mock('react-router-dom', () => ({
  Link: () => null,
}));

describe('<Avatar />', () => {
  let wrapper: ReactWrapper<{}, {}>;

  const initialState = {
    avatar: {
      username: 'Username',
      userAvatarUrl: 'userAvatarUrl',
    },
  };
  const { store } = configureStore(initialState);
  const dispatch = jest.fn();
  store.dispatch = dispatch;
  const fetchUser = jest.fn();
  jest
    .spyOn(avatartHooks, 'useFetchUser')
    .mockImplementation(() => [{ loading: false }, fetchUser]);

  describe('render', () => {
    beforeEach(() => {
      wrapper = mount(
        <IntlProvider locale="en" messages={flattenMessages(enMessages)}>
          <Provider store={store}>
            <Avatar />
          </Provider>
        </IntlProvider>,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call onInputChange when writing in the text input', () => {
      const input = wrapper.find(Input);
      input.simulate('change', { target: { value: 'MyUsername' } });
      expect(dispatch).toHaveBeenCalledWith({
        meta: undefined,
        type: 'Avatar/updateUsername',
        payload: 'MyUsername',
      });
    });

    it('should call fetchUser when clicking submitting form', () => {
      const form = wrapper.find('form').first();
      form.simulate('submit');
      expect(fetchUser).toHaveBeenCalled();
    });

    it('should display an image if userAvatarUrl is set', () => {
      const image = wrapper.find('img');
      expect(image).toHaveLength(1);
      expect(image.prop('src')).toBe('userAvatarUrl');
    });
  });
});
