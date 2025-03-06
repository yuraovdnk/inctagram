import { BillingServiceFacade } from './billing-ms/billing-service.facade';

export const FILES_SERVICE = Symbol('FILES_SERVICE');
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import { FilesServiceFacade } from './files-ms/files-service.fasade';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FILE_SERVICE_HOST,
          port: +process.env.FILE_SERVICE_PORT,
        },
      },
      {
        name: 'BILLING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: 3001,
        },
      },
    ]),
  ],
  providers: [FilesServiceFacade, BillingServiceFacade],
  exports: [FilesServiceFacade, BillingServiceFacade],
})
export class ServicesModule {
  constructor() {}
}
