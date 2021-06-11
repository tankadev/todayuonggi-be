import { HttpService, Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DetailDeliveryRO } from './detail-delivery.ro';

@Injectable()
export class AppService {

  headers = {
    'accept': 'application/json, text/plain, */*',
    'x-foody-api-version': '1',
    'x-foody-app-type': '1004',
    'x-foody-client-language': 'vi',
    'x-foody-client-type': '1',
    'x-foody-client-version': '3.0.0',
    'x-foody-client-id': ''
  };

  constructor(
    private readonly httpService: HttpService
  ) { }

  serverInit(): string {
    return 'Hello, I am TodayUongGi Server! Nice to meet you ^_^';
  }

  async getDetail(query: {url: string}): Promise<any> {
    return (await this.getDeliveryId(query));
  }

  private async getDeliveryId(query: {url: string}) {
    return this.httpService.get(`https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=${query.url}`,{headers: this.headers}).pipe(
      map((res) => {
        const { delivery_id } = res.data.reply;
        return delivery_id;
      }),
      mergeMap(deliveryId => {
        const info = this.httpService.get(`https://gappapi.deliverynow.vn/api/delivery/get_detail?id_type=2&request_id=${deliveryId}`, {headers: this.headers});
        const dishes = this.httpService.get(`https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=2&request_id=${deliveryId}`, {headers: this.headers});
        return forkJoin({info, dishes}).pipe(map(({info, dishes}) => {
          return this.formatData({info: info.data, dishes: dishes.data});
        }));
      })
    );
  }

  private formatData(inputData: {info: any, dishes: any}): DetailDeliveryRO {
    const detailRo = new DetailDeliveryRO();
    const { rating, address, url, name, res_photos } = inputData.info.reply.delivery_detail;
    detailRo.name = name;
    detailRo.address = address;
    detailRo.rating = rating.avg;
    detailRo.displayTotalReview = rating.display_total_review;
    detailRo.url = url;
    detailRo.photos = res_photos.length > 0 ? res_photos[0].photos : [];

    return detailRo;
  }

}
