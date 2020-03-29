import reducer, { updateUser, updateUsername } from '../slice';

describe('[Reducer] Avatar reducer', () => {
  const previousState = {
    username: null,
    userAvatarUrl: null,
  };

  describe('UPDATE_USERNAME case', () => {
    const action = updateUsername('juste_leblanc');

    it('should set username', () => {
      const state = reducer(undefined, action);
      expect(state).toEqual({
        userAvatarUrl: null,
        username: 'juste_leblanc',
      });
    });

    it('should modify state immutably', () => {
      const state = reducer(previousState, action);
      expect(state).not.toBe(previousState);
    });
  });

  describe('USER_FETCH_SUCCESS case', () => {
    const action = updateUser({ avatar_url: 'avatar_url' });

    it('should set userAvatarUrl', () => {
      const state = reducer(undefined, action);
      expect(state).toEqual({
        userAvatarUrl: 'avatar_url',
        username: null,
      });
    });

    it('should modify state immutably', () => {
      const state = reducer(previousState, action);
      expect(state).not.toBe(previousState);
    });
  });
});
