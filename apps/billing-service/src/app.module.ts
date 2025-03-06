import { Module } from '@nestjs/common';
import { PaymentsController } from './modules/payments/api/payments.controller';
import { PaymentGateway } from './modules/payments/infrastructure/strategies/payment.gateway';
import { StripeStrategy } from './modules/payments/infrastructure/strategies/stripe.strategy';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from '../../../libs/common/config/env.config';
import { PaymentsWebhookController } from './modules/payments/api/payments-webhook.controller';
import { BillingPrismaService } from '../../../libs/adapters/db/billing.prisma.service';
import { PaymentsRepository } from './modules/payments/infrastructure/repos/payments.repository';
import { CreatePaymentCommandHandler } from './modules/payments/application/commands/create.payment.command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CompletePaymentCommandHandler } from './modules/payments/application/commands/complete.payment.command.handler';
import { RMQModule } from 'nestjs-rmq';

const commands = [CreatePaymentCommandHandler, CompletePaymentCommandHandler];
@Module({
  imports: [
    RMQModule.forRoot({
      exchangeName: 'incta',
      connections: [
        {
          login: 'guest',
          password: 'guest',
          host: 'localhost',
        },
      ],
      prefetchCount: 32,
      serviceName: 'inctagram',
    }),
    CqrsModule,
    ConfigModule.forRoot({
      load: [getEnvConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [
    ...commands,
    PaymentGateway,
    StripeStrategy,
    PaymentsRepository,
    BillingPrismaService,
  ],
})
export class AppModule {}
