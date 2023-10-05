import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
export const FILES_SERVICE = Symbol('FILES_SERVICE');

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: FILES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.FILE_SERVICE_HOST,
          port: +process.env.FILE_SERVICE_PORT,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ServicesModule {}
