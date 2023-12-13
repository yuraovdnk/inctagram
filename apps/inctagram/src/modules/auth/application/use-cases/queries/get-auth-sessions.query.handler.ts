import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { AuthSessionViewDto } from '../../dto/response/auth-session.view.dto';

export class GetAuthSessionsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetAuthSessionsQuery)
export class GetAuthSessionsQueryHandler
  implements IQueryHandler<GetAuthSessionsQuery>
{
  constructor(private authRepository: AuthRepository) {}
  async execute(query: GetAuthSessionsQuery): Promise<any> {
    const sessions = await this.authRepository.getAuthSessions(query.userId);
    return NotificationResult.Success(
      sessions.map((item) => new AuthSessionViewDto(item)),
    );
  }
}
