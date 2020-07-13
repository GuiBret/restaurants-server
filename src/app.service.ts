import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { StandardResponse } from './interfaces/StandardResponse.interface';


@Injectable()
export class AppService implements OnModuleInit {
  token: string;
  apiKey: string;
  yelpRoot: string;

  constructor(private http: HttpService, private config: EasyconfigService) {}
  getHello(): string {
    return "Hello World!";
  }

  onModuleInit(): void {
    
    this.apiKey = this.config.get('YELPAPIKEY');
    this.yelpRoot = this.config.get('YELPROOT');
    
    
  } 

  getToken(): string {
    return this.token;
  }

  getRestaurants(params: { latitude: string; longitude: string; }): Observable<StandardResponse> {
    return new Observable((observer) => {
      if(!params.latitude || !params.longitude) {
        observer.error('Paramètre manquant');
        
      } else {
        
        this.http.get(this.yelpRoot + '/businesses/search?latitude=' + params.latitude + '&longitude=' + params.longitude, {headers: {Authorization: 'Bearer ' + this.apiKey}}).subscribe((response) => {

          const parsedBusinesses = response.data.businesses.map((business) => {
            
            // return business;

            return {
              name: business.name,
              image: business.image_url,
              address: business.location.display_address.join('\r\n'),
              latitude: business.coordinates.latitude,
              longitude: business.coordinates.longitude,
              id: business.id
            }
          });
          
          observer.next({data: {businesses: parsedBusinesses}, errors: []});
          observer.complete();
        });
      }

    });
  }
}
