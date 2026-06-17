import { CredentialsSignin } from "next-auth";

import { AUTH_ERROR_CODES } from "../constants";

export class InvalidCredentialsError extends CredentialsSignin {
  override code = AUTH_ERROR_CODES.INVALID_CREDENTIALS;
}

export class AccountDisabledError extends CredentialsSignin {
  override code = AUTH_ERROR_CODES.ACCOUNT_DISABLED;
}

export class SessionExpiredError extends CredentialsSignin {
  override code = AUTH_ERROR_CODES.SESSION_EXPIRED;
}
