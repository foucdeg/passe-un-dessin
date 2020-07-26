export interface User {
  email: string;
}

export interface Player {
  name: string;
  uuid: string;
  color: string;
  user?: null | User;
}
