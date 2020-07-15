import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { StandardResponse } from './interfaces/StandardResponse.interface';
import { URLSearchParams } from 'url';


@Injectable()
export class AppService implements OnModuleInit {
  token: string;
  yelpAPIKey: string;
  yelpRoot: string;

  hereAPIKey: string;
  hereGeocodingRoot: string;

  constructor(private http: HttpService, private config: EasyconfigService) {}
  getHello(): string {
    return "Hello World!";
  }

  onModuleInit(): void {
    
    this.yelpAPIKey = this.config.get('YELPAPIKEY');
    this.yelpRoot = this.config.get('YELPROOT');

    this.hereAPIKey = this.config.get('HEREAPIKEY');
    this.hereGeocodingRoot = this.config.get('HEREGEOCODINGROOT');
    
    
  } 

  getToken(): string {
    return this.token;
  }

  getRestaurants(params: { latitude: string; longitude: string; }): Observable<StandardResponse> {
    return new Observable((observer) => {
      if(!params.latitude || !params.longitude) {
        observer.error('Missing parameter');
        
      } else {
        const searchParams = {
          categories: 'restaurants',
          latitude: params.latitude,
          longitude: params.longitude
        };

        // TODO : add an interceptor
        this.http.get(this.yelpRoot + '/businesses/search?' + new URLSearchParams(searchParams).toString(), {headers: {Authorization: 'Bearer ' + this.yelpAPIKey}}).subscribe((response) => {

          const parsedBusinesses = response.data.businesses.map((business) => {
            
            return {
              name: business.name,
              image: business.image_url,
              address: business.location.display_address.join('\r\n'),
              latitude: business.coordinates.latitude,
              longitude: business.coordinates.longitude,
              distance: parseInt(business.distance),
              id: business.id
            }
          }).sort((a, b) => {
            return (a.distance > b.distance) ? 1 : -1; 
          });
          
          observer.next({data: {businesses: parsedBusinesses}, errors: []});
          observer.complete();
        });
      }

    });
  }

  getGeocoding(searchString: string) : Observable<any>{
    
    
    return new Observable((observer) => {
      
      if(searchString === '') {
        
        observer.error('Empty query parameter');
       
      } else {
        const params = {
          q: searchString,
          apikey: this.hereAPIKey
        };
  
        
    
        this.http.get(this.hereGeocodingRoot + '?' + new URLSearchParams(params).toString()).subscribe((geocoderResponse) => {
          const results: StandardResponse = geocoderResponse.data.items.map((currResult) => ({name: currResult.title, latitude: currResult.position.lat, longitude: currResult.position.lng}));
          
          observer.next({data: {results: results}, errors: []});
          observer.complete();
        });

      }

      
      
      
      
    });


  }
}
