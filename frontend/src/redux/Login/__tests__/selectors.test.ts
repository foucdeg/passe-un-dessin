import { state } from '__fixtures__/state';
import { getUserToken } from '../selectors';

const token = 'OX1dSSVRFX1BPU1QsQ0FOX1JFQURfTkV';

const initialState = { ...state, login: { token } };

describe('Login selectors', () => {
  describe('getUserToken function', () => {
    it('Should return the value stored in store.login.token', () => {
      expect(getUserToken(initialState)).toBe(token);
    });
  });
});
