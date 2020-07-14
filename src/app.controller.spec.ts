import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpService, HttpModule } from '@nestjs/common';
import { EasyconfigService, EasyconfigModule } from 'nestjs-easyconfig';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let mockEasyConfig: Partial<EasyconfigService>;

  mockEasyConfig = {
    get: function(param: string) { return '';}
  }
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [EasyconfigModule.register({path: './config/.env'}), HttpModule],
      controllers: [AppController],
      providers: [AppService, {useValue: mockEasyConfig, provide: EasyconfigService}],
    }).compile();

    appService = await app.resolve(AppService);
    appController = new AppController(appService);
  });


  // TODO : handle
  describe('On module init', () => {
    it('should properly initialize everything', () => {
      appService['onModuleInit']();
    })
  })

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
        expect(error).toBe('Missing parameter');
        done();
      })
    })
  });
  describe('getGeocoding', () => {
    it('should return an error since the query parameter is empty', (done) => {
      appController.getGeocoding({q: ''}).subscribe(() => {
        return;
        
      }, (error) => {
        expect(error).toBe('Empty query parameter');
        done();
      })
    })
  });
});
