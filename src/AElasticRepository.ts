import { Client, RequestParams } from '@elastic/elasticsearch';
import ICrudRepository from './ICrudRepository';
import IFactory from './IFactory';
import Config from '../Config';
import ElasticConnector from '../ElasticConnector';

export default abstract class AElasticRepository<T> implements ICrudRepository<T> {
  protected readonly index: string;

  protected constructor(
    protected readonly factory: IFactory<T>,
    protected readonly connector: ElasticConnector,
    protected readonly config: Config) {
    this.index = config.elasticsearchIndex;
  }

  public async createOne(item: T): Promise<T> {
    return this.elasticIndex(item);
  }

  public createMany(items: T[]): Promise<T[]> {
    const indexRequest: RequestParams.Index<T[]> = {
      index: this.index,
      body: items,
    };

    return this.connector.client
      .bulk(indexRequest)
      .then(res => res.body);
  }

  public async readOne(id: string): Promise<T | null> {
    await this.connector.client.indices.refresh({ index: this.index });

    const getRquest: RequestParams.Get = {
      id,
      index: this.index,
    };

    return this.connector.client
      .get(getRquest)
      .then(res => this.factory.makeEntity(res.body));
  }

  public async read(predicate: any): Promise<T[]> {
    await this.connector.client.indices.refresh({ index: this.index });

    return this.connector.client
      .search({
        index: this.index,
        body: predicate,
      })
      .then((res) => {
        const hits = res.body.hits.hits as any[];
        return hits.map(i => this.factory.makeEntity(i));
      });
  }

  public async readAll(): Promise<T[]> {
    const getRquest: RequestParams.Search = {
      index: this.index,
      size: 1000,
    };

    return this.connector.client
      .search(getRquest)
      .then((res) => {
        const hits = res.body.hits.hits as any[];
        return hits.map(i => this.factory.makeEntity(i));
      });
  }

  public update(item: T, id: string): Promise<T | null> {
    return this.elasticIndex(item, id);
  }

  public deleteOne(id: string): Promise<any> {
    const deleteRequest: RequestParams.Delete = {
      id,
      index: this.index,
    };

    return this.connector.client.delete(deleteRequest);
  }

  private async elasticIndex(item: T, id?: string): Promise<T> {
    const indexRequest: RequestParams.Index<T> = {
      id,
      index: this.index,
      body: item,
      refresh: 'true',
    };
    const response = await this.connector.client.index(indexRequest);
    const getRequest: RequestParams.Get = {
      id: response.body._id,
      index: this.index,
    };

    return this.connector.client
      .get(getRequest)
      .then(res =>  this.factory.makeEntity(res.body));
  }
}
