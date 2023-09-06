import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenViewDto {
  @ApiProperty({
    format: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzN2Q1M2JhMi0xNDg5LTQyMWYtYmZkZS0zYTU4OWYwYmJiODYiLCJkZXZpY2VJZCI6Ijg1ZDI5MzE3LTVjOTctNDE2Yi1iZDFmLWZmM2U1YTQxNDNkYSIsImlhdCI6MTY5Mzk4ODQxNCwiZXhwIjoxNjkzOTg5MzE0fQ.y5YR19d3t16JL7v8IJpn0y3eZsMMzVxlqMgKdctDt7g',
  })
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
