import { ResponseToolkit, ResponseObject } from 'hapi';

export default interface IHttpResponse {
  statusCode: number;
  body?: object;
  headers?: Record<string, string>;
}

export const toHapiResponse = (response: IHttpResponse, h: ResponseToolkit): ResponseObject => {
  let responseObject = h.response(response.body).code(response.statusCode);

  if (response.headers) {
    for (const header of Object.keys(response.headers)) {
      responseObject = responseObject.header(header, response.headers[header]);
    }
  }

  return responseObject;
};
