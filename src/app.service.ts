import { HttpService, Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DetailDeliveryRO, Dish, MenuInfo, Voucher } from './detail-delivery.ro';

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
    return (await this.getDeliveryInformation(query));
  }

  private async getDeliveryInformation(query: {url: string}) {
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
    const { rating, address, url, name, res_photos, delivery, price_slash_discounts } = inputData.info.reply.delivery_detail;
    const { menu_infos } = inputData.dishes.reply;
    detailRo.name = name;
    detailRo.address = address;
    detailRo.rating = rating.avg;
    detailRo.displayTotalReview = rating.display_total_review;
    detailRo.url = url;
    detailRo.photos = res_photos.length > 0 ? res_photos[0].photos : [];
    detailRo.voucher = this.formatDataVoucher(delivery.promotions, price_slash_discounts);
    detailRo.menus = this.formatDataMenu(menu_infos);

    return detailRo;
  }

  private formatDataVoucher(dataPromotions: any[], dataDiscounts: any[]): Voucher[] {
    const vouchers: Voucher[] = [];
    if (dataPromotions.length > 0) {
      dataPromotions.forEach(promotion => {
        const { icon, short_title, promo_code, expired } = promotion;
        const voucher = new Voucher();
        voucher.code = promo_code;
        voucher.content = short_title;
        voucher.expired = expired;
        voucher.icon = icon;
        voucher.isPromotion = true;
        vouchers.push(voucher);
      });
    }

    if (dataDiscounts.length > 0) {
      dataDiscounts.forEach(discount => {
        const { icon, short_title, promo_code, expired } = discount;
        const voucher = new Voucher();
        voucher.code = promo_code;
        voucher.content = short_title;
        voucher.expired = expired;
        voucher.icon = icon;
        voucher.isPromotion = false
        vouchers.push(voucher);
      });
    }

    return vouchers;
  }

  private formatDataMenu(inputMenus: any[]): MenuInfo[] {
    const menus: MenuInfo[] = [];
    if (inputMenus.length > 0) {
      inputMenus.forEach(menu => {
        const { dish_type_id, dish_type_name, dishes } = menu;
        const menuRo: MenuInfo = new MenuInfo();
        menuRo.id = dish_type_id;
        menuRo.name = dish_type_name;
        menuRo.dishes = this.formatDataEachMenuItem(dishes);
        menus.push(menuRo);
      })
    }
    return menus;
  }

  private formatDataEachMenuItem(dishes: any[]): Dish[] {
    const menuItems: Dish[] = [];
    if (dishes.length > 0) {
      dishes.forEach(dish => {
        const { id, description, name, photos, total_like, discount_price,
          price, options, is_active, is_available, is_deleted } = dish;
        const menuItem = new Dish();
        menuItem.id = id;
        menuItem.name = name;
        menuItem.description = description;
        menuItem.price = price;
        menuItem.discountPrice = discount_price;
        menuItem.isActive = is_active;
        menuItem.isAvailable = is_available;
        menuItem.isDelete = is_deleted;
        menuItem.options = options;
        menuItem.photos = photos;
        menuItem.totalLike = total_like;
        menuItems.push(menuItem);
      });
    }
    return menuItems;
  }

}
