import { Injectable } from '@nestjs/common';
import { BillingPrismaService } from '../../../../../../../libs/adapters/db/billing.prisma.service';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentMapper } from './mapper/payments.mapper';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prismaClient: BillingPrismaService) {}

  async save(data: PaymentEntity) {
    const res = await this.prismaClient.payments.upsert({
      where: {
        id: data.id,
      },
      update: data,
      create: data,
    });
    return res.id;
  }

  async getById(id: string) {
    const res = await this.prismaClient.payments.findUnique({ where: { id } });
    return PaymentMapper.toEntity(res);
  }
}
