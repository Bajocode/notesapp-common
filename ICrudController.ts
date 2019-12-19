import IHttpResponse from './IHttpResponse';

export default interface IController {
  handleGet: () => Promise<IHttpResponse>;
  handleGetId: (id: string) => Promise<IHttpResponse>;
  handlePost: (body: any) => Promise<IHttpResponse>;
  handlePut: (id: string, body: any) => Promise<IHttpResponse>;
  handleDelete: (id: string) => Promise<IHttpResponse>;
}
