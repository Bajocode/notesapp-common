export default interface IFactory<T> {
  makeEntity(object: any): T;
  makeObject(object: T): any;
}