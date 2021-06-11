import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { DetailDeliveryRO } from './detail-delivery.ro';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.serverInit();
  }

  @Get('get-detail')
  async getDetailByUrl(@Query() query: {url: string}): Promise<any> {
    return await this.appService.getDetail(query);
  }
}
