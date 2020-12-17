import { Controller, All, Body, HttpStatus, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All([':service', ':service/*'])
  async commonHandler(@Req() req: Request, @Param() params, @Body() body: any, @Query() query: any, @Res() res: Response): Promise<object> {
    const url = this.appService.getServiceUrlByName(params.service);
    if (!url) {
      return res.status(HttpStatus.BAD_GATEWAY)
        .json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: 'Cannot process request'
        });
    }
    const config = {
      method: req.method,
      url: `${url}${this.appService.makeOriginalUrl(req.originalUrl)}`,
      ...(Object.keys(body || {}).length > 0 ? { data: body } : null)
    };
    console.log('logs', { url, originalUrl: req.originalUrl, config });
    const isCachedRequest = req.originalUrl === '/product/products' && req.method === 'GET';
    try {
      if (isCachedRequest) {
        const productsFromCache = this.appService.get('products');
        if (productsFromCache) {
          console.log('FROM CACHE');
          return res.status(HttpStatus.NOT_MODIFIED).json(productsFromCache);
        }
      }
      const response = await axios.request(config as AxiosRequestConfig);
      if (isCachedRequest) {
        this.appService.put('products', response.data);
      }
      res.json(response.data);
    } catch(error) {
      console.log('error', error.response.data)
      if (error?.response) {
        const { data, status } = error.response;
        return res.status(status).json(data);
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}