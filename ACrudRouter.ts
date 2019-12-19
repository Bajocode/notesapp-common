import { ServerRoute } from 'hapi';
import { toHapiResponse } from './IHttpResponse';
import ACrudController from './ACrudController';
import ACrudValidator from './ACrudValidator';
import IEntity from './IEntity';

export default class ACrudRouter<T extends IEntity> {
  protected get(
    controller: ACrudController<T>,
    resourceName: string,
    authEnabled: boolean = false): ServerRoute {

    return {
      method: 'GET',
      path: `/${resourceName}`,
      handler: async (request, h) => {
        const response = await controller.handleGet();
        return toHapiResponse(response, h);
      },
      options: {
        auth: authEnabled ? 'jwt' : false,
        description: `GET ${resourceName}`,
        notes: `Retrieve all ${resourceName}`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              200: { description: 'OK' },
              400: { description: 'Bad Request' },
            },
          },
        },
      },
    };
  }

  protected getId(
    controller: ACrudController<T>,
    validator: ACrudValidator,
    resourceName: string,
    authEnabled: boolean = false): ServerRoute {
    return {
      method: 'GET',
      path: `/${resourceName}/{id}`,
      handler: async (request, h) => {
        const response = await controller.handleGetId(request.params.id);
        return toHapiResponse(response, h);
      },
      options: {
        auth: authEnabled ? 'jwt' : false,
        validate: { params: { id: validator.paramsObjectIdSchema } },
        description: `GET ${resourceName.slice(0, -1)}`,
        notes: `Retrieve ${resourceName.slice(0, -1)} by id`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              200: { description: 'OK' },
              400: { description: 'Bad Request' },
              404: { description: 'Not Found' },
            },
          },
        },
      },
    };
  }

  protected post(
    controller: ACrudController<T>,
    validator: ACrudValidator,
    resourceName: string,
    authEnabled: boolean = false): ServerRoute {
    return {
      method: 'POST',
      path: `/${resourceName}`,
      handler: async (request, h) => {
        const response = await controller.handlePost(request.payload);
        return toHapiResponse(response, h);
      },
      options: {
        auth: authEnabled ? 'jwt' : false,
        validate: { payload: validator.payloadCreateSchema },
        description: `POST ${resourceName.slice(0, -1)}`,
        notes: `Create a new ${resourceName.slice(0, -1)} with a valid payload`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              201: { description: 'Created' },
              400: { description: 'Bad Request' },
            },
          },
        },
      },
    };
  }

  protected put(
    controller: ACrudController<T>,
    validator: ACrudValidator,
    resourceName: string,
    authEnabled: boolean = false): ServerRoute {
    return {
      method: 'PUT',
      path: `/${resourceName}/{id}`,
      handler: async (request, h) => {
        const response = await controller.handlePut(request.params.id, request.payload);
        return toHapiResponse(response, h);
      },
      options: {
        auth: authEnabled ? 'jwt' : false,
        validate: {
          payload: validator.payloadUpdateSchema,
          params: { id: validator.paramsObjectIdSchema },
        },
        description: `PUT ${resourceName.slice(0, -1)}`,
        notes: `Update a new ${resourceName.slice(0, -1)} idempotently with a valid payload and id`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              204: { description: 'No Content' },
              400: { description: 'Bad Request' },
              404: { description: 'Not Found' },
            },
          },
        },
      },
    };
  }

  protected delete(
    controller: ACrudController<T>,
    validator: ACrudValidator,
    resourceName: string,
    authEnabled: boolean = false): ServerRoute {
    return {
      method: 'DELETE',
      path: `/${resourceName}/{id}`,
      handler: async (request, h) => {
        const response = await controller.handleDelete(request.params.id);
        return toHapiResponse(response, h);
      },
      options: {
        auth: authEnabled ? 'jwt' : false,
        validate: {
          params: { id: validator.paramsObjectIdSchema },
        },
        description: `DELETE ${resourceName.slice(0, -1)}`,
        notes: `Delete a ${resourceName.slice(0, -1)} idempotently with a valid id`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              204: { description: 'No Content' },
              400: { description: 'Bad Request' },
            },
          },
        },
      },
    };
  }
}
