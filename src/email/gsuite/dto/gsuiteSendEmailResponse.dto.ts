import { ApiProperty } from '@nestjs/swagger';

export class GsuiteSendEmailResponseDto {
  @ApiProperty()
  message: string;
}
