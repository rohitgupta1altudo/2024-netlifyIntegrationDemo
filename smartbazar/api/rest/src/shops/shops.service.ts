import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateShopDto } from '@packages/commerce/dist/shops/dto/create-shop.dto';
import { UpdateShopDto } from '@packages/commerce/dist/shops/dto/update-shop.dto';
import { Shop } from '@packages/commerce/dist/shops/entities/shop.entity';
import shopsJson from './shops.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from '@packages/commerce/dist/shops/dto/get-shops.dto';
import { paginate } from '@packages/commerce/dist/common/pagination/paginate';
import { GetStaffsDto } from '@packages/commerce/dist/shops/dto/get-staffs.dto';

const shops = plainToInstance(Shop, shopsJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);
@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;

  create(createShopDto: CreateShopDto) {
    return this.shops[0];
  }

  getShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Shop[] = this.shops;
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/shops?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }
  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = this.shops.find((p) => p.id === shop_id)?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  getShop(slug: string): Shop {
    return this.shops.find((p) => p.slug === slug);
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.shops[0];
  }

  approve(id: number) {
    return `This action removes a #${id} shop`;
  }
  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
