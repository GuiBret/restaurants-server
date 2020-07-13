import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';


@Injectable()
export class AppService implements OnModuleInit {
  token: string;
  apiKey: string;
  yelpRoot: string;

  constructor(private http: HttpService, private config: EasyconfigService) {}
  getHello(): string {
    return this.yelpRoot;
  }

  onModuleInit(): void {
    
    this.apiKey = this.config.get('YELPAPIKEY');
    this.yelpRoot = this.config.get('YELPROOT');
    
    
  } 

  getToken(): string {
    return this.token;
  }

  getRestaurants(params): Observable<string> {
    return new Observable((observer) => {
      if(!params.latitude || !params.longitude) {
        observer.error('Paramètre manquant');
        
      } else {
        
        this.http.get('https://api.yelp.com/v3/businesses/search?latitude=' + params.latitude + '&longitude=' + params.longitude, {headers: {Authorization: 'Bearer ' + this.apiKey}}).subscribe((response) => {

        // let response_sent = response.data.businesses.map(() => {

        // });
          observer.next(response.data.businesses);
          observer.complete();
        });
      }

    });
  }
}
