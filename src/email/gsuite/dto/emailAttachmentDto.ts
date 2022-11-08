import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailAttachmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Имя файла вложения' })
  filename: string;

  @IsString()
  @ApiProperty({ description: 'Данные файла вложения в формате base64' })
  content_base64: string;
}
