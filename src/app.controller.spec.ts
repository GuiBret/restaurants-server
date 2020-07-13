import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpService, HttpModule } from '@nestjs/common';
import { EasyconfigService, EasyconfigModule } from 'nestjs-easyconfig';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let mockEasyConfig: Partial<EasyconfigService>;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [EasyconfigModule.register({path: './config/.env'}), HttpModule],
      controllers: [AppController],
      providers: [AppService, {useValue: mockEasyConfig, provide: EasyconfigService}],
    }).compile();

    appService = await app.resolve(AppService);
    appController = new AppController(appService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getRestaurants', () => {
    it('should return an error since we have not provided any latitude nor longitude', (done) => {
      appController.getRestaurantsMatchingConditions({}).subscribe(() => {
        return;
        
      }, (error) => {
        expect(error).toBe('Paramètre manquant');
        done();
      })
    })
  })
});
