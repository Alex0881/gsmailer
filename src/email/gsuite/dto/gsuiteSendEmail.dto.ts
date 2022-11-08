import { EmailAttachmentDto } from './emailAttachmentDto';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GsuiteSendEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'asa@asas.ru', description: 'Email адрес' })
  emailAddress: string;

  @IsString()
  @ApiProperty({ description: 'Тема письма' })
  letterTopic: string;

  @IsString()
  @ApiProperty({ description: 'Текст письма' })
  letterText: string;

  @IsString()
  @ApiProperty({
    description: 'Текст письма в формате HTML (для писем в формате HTML)',
  })
  letterTextHTML: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailAttachmentDto)
  @ApiProperty({
    description: 'Массив вложений письма',
    isArray: true,
    type: () => [EmailAttachmentDto],
  })
  letterAttachments: EmailAttachmentDto[];

  @IsNotEmpty()
  @ApiProperty({ description: 'Токен от приложения Google' })
  access_token: string;
}
