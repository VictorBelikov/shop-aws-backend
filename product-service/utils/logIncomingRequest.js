export const logIncomingRequest = ({ httpMethod, path, pathParameters, queryStringParameters }) => {
  console.info(
    `method: ${httpMethod}; path: ${path}; path params: ${
      pathParameters ? JSON.stringify(pathParameters) : ''
    }; query params: ${queryStringParameters ? JSON.stringify(queryStringParameters) : ''}`,
  );
};
