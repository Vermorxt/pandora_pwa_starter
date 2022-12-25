export enum ApiAuthDefinition {
  POST_AUTH = '/auth',
  POST_USER = '/auth/user',
  GET_USERS = '/auth/users',
  GET_USER_BY_ID = '/auth/user/{id}',
  PATCH_USER_BY_ID = '/auth/user/{id}',
  DELETE_USER_BY_ID = '/auth/user/{id}',
  POST_PASSWORD_RESET_EMAIL = '/auth/password/reset',
  POST_PASSWORD_RESET_UPDATE = '/auth/password/update',
}
