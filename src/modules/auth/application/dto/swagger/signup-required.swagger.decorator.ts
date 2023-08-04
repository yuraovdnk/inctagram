import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SignUpDto } from '../request/sign-up.dto';

export const SignupRequired = () =>
  applyDecorators(
    ApiOkResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to passed email address',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with the given email or password already exists)',
    }),
    ApiBody({ type: SignUpDto }),
    ApiOperation({ summary: 'signup' }),
  );
