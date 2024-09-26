import { PrismaClientManager } from '../../../../libs/adapters/db/prisma/prisma-client-manager';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaService } from '../../../../libs/adapters/db/prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('PrismaClientManager', () => {
  let prismaClientManager: PrismaClientManager;
  let transactionClientMock: Prisma.TransactionClient;
  let prismaServiceMock: PrismaService;
  let alsMock: AsyncLocalStorage<any>;

  beforeEach(() => {
    transactionClientMock = {
      user: {},
    } as Prisma.TransactionClient;

    prismaServiceMock = {
      user: {},
    } as PrismaService;

    alsMock = {
      getStore: jest.fn().mockReturnValue({ prisma: transactionClientMock }),
    } as unknown as AsyncLocalStorage<any>;

    prismaClientManager = new PrismaClientManager(prismaServiceMock, alsMock);
  });

  it('should return transaction client from ALS if available', () => {
    const getClientSpy = jest.spyOn(prismaClientManager, 'getClient', 'get');

    const client = prismaClientManager.getClient;

    expect(getClientSpy).toHaveBeenCalled();
    expect(client).toBe(transactionClientMock);
  });

  it('should return PrismaService if no transaction client in ALS', () => {
    (alsMock.getStore as jest.Mock).mockReturnValue(null);
    const getClientSpy = jest.spyOn(prismaClientManager, 'getClient', 'get');
    const client = prismaClientManager.getClient;

    expect(getClientSpy).toHaveBeenCalled();
    expect(client).toBe(prismaServiceMock);
  });
});
