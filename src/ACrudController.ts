import boom from 'boom';
import IHttpResponse from './IHttpResponse';
import ICrudController from './ICrudController';
import ICrudRepository from './ICrudRepository';
import IFactory from './IFactory';
import IEntity from './IEntity';

export default abstract class ACrudController<T extends IEntity> implements ICrudController {
  protected constructor(
    private readonly repository: ICrudRepository<T>,
    private readonly factory: IFactory<T>,
    protected readonly resourceName: string) {}

  public async handleGet(): Promise<IHttpResponse> {
    const result = await this.repository.readAll();
    const transportObjects = result.map(i => this.factory.makeObject(i));

    return {
      statusCode: 200,
      body: transportObjects,
    };
  }

  public async handleGetId(id: string): Promise<IHttpResponse> {
    const result = await this.repository.readOne(id)
      .catch((error) => {
        if (error.statusCode === 404) throw boom.notFound();
      });

    if (!result) throw boom.notFound();

    return {
      statusCode: 200,
      body: this.factory.makeObject(result),
    };
  }

  public async handlePost(body: any): Promise<IHttpResponse> {
    const result = await this.repository.createOne(body as T);

    return {
      statusCode: 201,
      body: this.factory.makeObject(result),
      headers: { location: `/${this.resourceName}/${result.id}` },
    };
  }

  public async handlePut(id: string, body: any): Promise<IHttpResponse> {
    const result = await this.repository.readOne(id)
      .catch((error) => {
        if (error.statusCode === 404) throw boom.notFound();
      });

    if (!result) throw boom.notFound();

    await this.repository.update(body, id);

    return {
      statusCode: 204,
    };
  }

  public async handleDelete(id: string): Promise<IHttpResponse> {
    const result = await this.repository.deleteOne(id)
      .catch((error) => {
        if (error.statusCode === 404) throw boom.notFound();
      });

    if (!result) throw boom.notFound();

    return {
      statusCode: 204,
    };
  }
}
