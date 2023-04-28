import { generatePolicy } from '../utils/generatePolicy';

const { GITHUB_LOGIN, PASSWORD } = process.env;

export const basicAuthorizer = (event, context, cb) => {
  if (event.type !== 'TOKEN') {
    cb('Unauthorized: TOKEN type is not provided');
  }

  try {
    const { methodArn, authorizationToken } = event;

    const encodedToken = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(encodedToken, 'base64');
    const [login, password] = buffer.toString('utf-8').split(':');

    const effect = !login || !password || login !== GITHUB_LOGIN || password !== PASSWORD ? 'Deny' : 'Allow';
    const policy = generatePolicy(encodedToken, methodArn, effect);
    cb(null, policy);
  } catch (e) {
    cb(`Unauthorized: ${e.message}`);
  }
};
