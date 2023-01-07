export enum Environment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
  Test = 'test',
}
export enum Language {
  English = 'en',
  German = 'de',
  Russian = 'ru',
  Turkish = 'tr',
  Arabic = 'ar',
}
export enum DateOption {
  SECONDS = 'seconds',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_M_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  BANDWIDTH_LIMIT_EXCEEDED = 509,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
export enum Product {
  Auth = 'auth',
  Pregnancy = 'pregnancy',
  Postnatal = 'postnatal',
  Ammely = 'ammely',
}
export enum CmsRole {
  Viewer = 'viewer',
  Editor = 'editor',
  Admin = 'admin',
}
export enum ErrorMessage {
  DoesNotMatchAnyEndpoint = 'Request does not match any endpoint',
  NotFound = 'Not found',
  UnableToProcess = 'Unable to process',
  TokenIsMissingOrInvalid = 'Token is missing or invalid',
  ExpectedParamsAreRequired = 'Expected Params are required',
  LimitOffsetAreRequired = 'Limit/Offset are required',
  EmailPasswordAreRequired = 'Email/Password are required',
  EmailOrPasswordDoesNotMatch = "Password or email doesn't match",
  UnableConnectToDatabase = 'Unable connect to the database',
  ForbiddenResource = 'Access to the requested resource is forbidden',
}
export enum OrderBy {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export enum UrlPublic {
  Root = '/',
  Other = '*/:id',
  Login = '/public/login',
  StartPage = '/public/startpage',
  PasswordReset = '/public/password-reset',
  PasswordNew = '/public/password-renew',
  ProjectSelection = '/dashboard/welcome/intro',
  NotFound = '/404',
}

export enum PathPublic {
  Root = '/public',
}

export enum UrlSettings {
  Settings = '/settings',
  Admins = '/settings/cms-users',
}

export enum Avatar {
  Default = '/static/media/png/user-avatar.png',
}

export enum BrowserName {
  Firefox = 'firefox',
  Chrome = 'chrome',
  Safari = 'safari',
  Edge = 'edge',
  Opera = 'opera',
}

export enum MessageType {
  Warning = 'warning',
  Negative = 'negative',
  Positive = 'positive',
}

export enum GoogleDocs {
  Link = 'https://docs.google.com/viewerng/viewer?url=',
}

export enum Auth {
  DefaultPassword = 'AbCT6g8FgHJ0',
}

export enum CmsUserRoles {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer',
}
