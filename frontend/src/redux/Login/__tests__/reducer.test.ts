import reducer, { userLoggedIn, userLoggedOut } from '../slice';

const token = 'OX1dSSVRFX1BPU1QsQ0FOX1JFQURfTkV';
const initialState = { token: null };

describe('Login reducer', () => {
  describe('USER_LOGIN_SUCCESS case', () => {
    it('Should return an initial state with a token in the token field', () => {
      const action = userLoggedIn(token);
      const expectedState = { ...initialState, token };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
});

describe('Logout reducer', () => {
  describe('USER_LOGOUT case', () => {
    it('Should remove all information about the logged in user', () => {
      const action = userLoggedOut;
      const loggedState = { token };
      const expectedState = initialState;

      expect(reducer(loggedState, action)).toEqual(expectedState);
    });
  });
});
