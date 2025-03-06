import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { Payments } from '@prisma/billing';

export class PaymentMapper {
  static toModel(postEntity: PaymentEntity): Payments {
    return {
      id: postEntity.id,
      userId: postEntity.userId,
      amount: postEntity.amount,
      createdAt: postEntity.createdAt,
      currency: postEntity.currency,
      paymentMethod: postEntity.paymentMethod,
      planId: postEntity.planId,
      status: postEntity.status,
      transactionId: postEntity.transactionId,
      updatedAt: postEntity.createdAt,
    };
  }

  static toEntity(payment: Payments): PaymentEntity {
    console.log(payment, 'payment from Prisma');
    const entity = new PaymentEntity();
    entity.id = payment.id;
    entity.amount = payment.amount;
    entity.paymentMethod = payment.paymentMethod;
    entity.planId = payment.planId;
    entity.userId = payment.userId;
    entity.currency = payment.currency;
    entity.status = payment.status as 'succeeded' | 'failed' | 'pending';
    entity.createdAt = payment.createdAt;
    return entity;
  }
}
