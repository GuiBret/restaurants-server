import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule } from 'nestjs-easyconfig';
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    EasyconfigModule.register({path: './config/.env'})
  ],
  controllers: [AppController],
  providers: [
    AppService
    
  ],
})
export class AppModule {}
  