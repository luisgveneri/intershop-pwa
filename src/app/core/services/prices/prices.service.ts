import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductPriceDetailsData } from 'ish-core/models/product-prices/product-prices.interface';
import { ProductPricesMapper } from 'ish-core/models/product-prices/product-prices.mapper';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class PricesService {
  private priceHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.pricing.v1+json',
  });

  constructor(private apiService: ApiService) {}

  getProductPrices(skus: string[], customerID?: string): Observable<ProductPriceDetails[]> {
    if (!skus || skus.length === 0) {
      return throwError(() => new Error('getProductPrices() called without skus'));
    }

    let params = new HttpParams();

    skus.map(sku => (params = params.append('sku', sku)));

    if (customerID) {
      params = params.set('customerID', customerID);
    }

    return this.apiService
      .get<{ data: ProductPriceDetailsData[] }>(`productprices`, { headers: this.priceHeaders, params })
      .pipe(map(element => element?.data?.map(prices => ProductPricesMapper.fromData(prices))));
  }
}
