import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('auth')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('restaurants')
  getRestaurantsMatchingConditions(@Query() params): Observable<any> {

    return this.appService.getRestaurants(params);
    
  }
}
