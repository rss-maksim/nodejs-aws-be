import { Injectable } from '@nestjs/common';
import { Service } from './const';

const CACHE_LIFE = 120000;
@Injectable()
export class AppService {
  cache: { [key: string]: unknown } = {};
  timeout: NodeJS.Timeout;

  getServiceUrlByName(service: string): string {
    switch (service) {
      case Service.product:
        return process.env.PRODUCTS_SERVICE_URL;
      case Service.cart:
        return process.env.CART_SERVICE_URL;
      default:
        return null;
    }
  }

  makeOriginalUrl(url: string): string {
    return `/${url.split('/').slice(2).join('/')}`;
  }

  put(key: string, payload: any): void {
    this.cache[key] = payload;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.clear(key), CACHE_LIFE);
  }

  get(key: string): any {
    return this.cache[key];
  }

  clear(key: string) {
    delete this.cache[key];
  }
}
