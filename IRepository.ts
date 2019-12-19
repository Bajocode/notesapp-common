export default interface IRepository<T> {
  createOne(item: T): Promise<T>;
  createMany(items: T[]): Promise<T[]>;

  readOne(id: string): Promise<T | null>;
  read(predicate: any): Promise<T[]>;
  readAll(): Promise<T[]>;

  deleteOne(id: string): Promise<T | null>;
}