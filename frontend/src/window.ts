enum FacebookAuthStatus {
  CONNECTED = 'connected',
  NOT_AUTHORIZED = 'not_authorized',
  UNKNOWN = 'unknown',
}

interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
}

export interface FacebookAuthStatusResponse {
  status: FacebookAuthStatus;
}

type SuccessfulFacebookAuthStatusResponse = FacebookAuthStatusResponse & {
  authResponse: FacebookAuthResponse;
};

export const isSuccessful = (
  response: FacebookAuthStatusResponse,
): response is SuccessfulFacebookAuthStatusResponse =>
  response.status === FacebookAuthStatus.CONNECTED;

export interface GoogleUser {
  clientId: string;
  credential: string;
  select_by: 'user';
}

export interface GoogleIdConfig {
  client_id: string;
  callback: (user: GoogleUser) => void;
}
