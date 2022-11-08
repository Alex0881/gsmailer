import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { GsuiteService } from './gsuite.service';
import { GsuiteSendEmailDto } from './dto/gsuiteSendEmail.dto';
import { GsuiteSendEmailResponseDto } from './dto/gsuiteSendEmailResponse.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorNestDto } from '../../common/dto/errorNest.dto';

@ApiTags('Gsuite mail')
@Controller('email/gsuite')
export class GsuiteController {
  constructor(private readonly service: GsuiteService) {}

  @Version('1')
  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: false,
      dismissDefaultMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  )
  @ApiOperation({ summary: 'Отправка письма через gSuite' })
  @ApiResponse({ status: 200, type: GsuiteSendEmailResponseDto })
  @ApiResponse({
    status: 422,
    description: 'Ошибка входных параметров',
    type: ErrorNestDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка компиляции письма или ошибка процесса отправки',
    type: ErrorNestDto,
  })
  async sendEmailV1(
    @Body() mailDto: GsuiteSendEmailDto,
  ): Promise<GsuiteSendEmailResponseDto> {
    return await this.service.sendEmailV1(mailDto);
  }
}
