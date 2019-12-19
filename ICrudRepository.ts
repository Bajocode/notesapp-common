export default interface IRepository<T> {
  createOne(item: T): Promise<T>;
  createMany(items: T[]): Promise<T[]>;
  readOne(id: string): Promise<T | null>;
  read(predicate: any): Promise<T[]>;
  readAll(): Promise<T[]>;
  update(item: T, id: string): Promise<T | null>;
  deleteOne(id: string): Promise<any>;
}
