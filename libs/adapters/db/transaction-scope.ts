export abstract class TransactionScope {
  abstract run(fn: () => Promise<any>): Promise<any>;
}
