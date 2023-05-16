import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export const getUserIdFromRequest = (request: AppRequest): string =>
  String(request.query.userId);
