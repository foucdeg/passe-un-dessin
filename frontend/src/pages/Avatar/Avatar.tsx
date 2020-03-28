import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/Button';
import { PATHS } from 'routes';
import {
  Container,
  Content,
  InputLabel,
  Input,
  Message,
  HomeLink,
  ErrorMessage,
} from './Avatar.style';
import useSelector from 'redux/useSelector';
import { useDispatch } from 'react-redux';
import { updateUsername } from 'redux/Avatar';
import { useFetchUser } from 'redux/Avatar/hooks';
import { Link as RouterLink } from 'react-router-dom';

const Avatar: React.FC = () => {
  const username = useSelector(state => state.avatar.username);
  const userAvatarUrl = useSelector(state => state.avatar.userAvatarUrl);
  const dispatch = useDispatch();
  const [{ loading, error }, doFetchUser] = useFetchUser();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateUsername(event.target.value));
  };

  const fetchUser = (event: React.FormEvent) => {
    event.preventDefault();
    if (username) {
      doFetchUser(username);
    }
  };

  return (
    <Container>
      <Content onSubmit={fetchUser}>
        <FormattedMessage id="page.back">
          {text => (
            <HomeLink as={RouterLink} to={PATHS.HOME}>
              &lt; {text}
            </HomeLink>
          )}
        </FormattedMessage>
        <FormattedMessage id="page.api-to-translate-example">
          {text => <Message>{text}</Message>}
        </FormattedMessage>
        <FormattedMessage id="page.add-github-username">
          {text => <InputLabel htmlFor="github-avatar-input">{text}</InputLabel>}
        </FormattedMessage>
        <Input id="github-avatar-input" type="text" onChange={onInputChange} />
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <FormattedMessage id="page.fetch-github-avatar">
          {text => (
            <Button disabled={loading} type="submit">
              {text}
            </Button>
          )}
        </FormattedMessage>
        {userAvatarUrl && <img src={userAvatarUrl} alt="user avatar" />}
      </Content>
    </Container>
  );
};

export default Avatar;
