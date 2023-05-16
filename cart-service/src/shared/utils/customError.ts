type CustomError = {
  stack: any;
  statusCode: number;
  code: string;
  message: string;
};

export const CustomError = (e: CustomError): CustomError => {
  console.log('--------> Error occurred: ', e);
  return e;
};
