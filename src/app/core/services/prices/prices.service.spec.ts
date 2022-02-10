import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ProductPriceDetailsData } from 'ish-core/models/product-prices/product-prices.interface';
import { ApiService } from 'ish-core/services/api/api.service';

import { PricesService } from './prices.service';

describe('Prices Service', () => {
  let apiServiceMock: ApiService;
  let pricesService: PricesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    pricesService = TestBed.inject(PricesService);
  });

  it('should be created', () => {
    expect(pricesService).toBeTruthy();
  });

  describe('getProductPrices', () => {
    beforeEach(() => {
      when(apiServiceMock.get<{ data: ProductPriceDetailsData[] }>('productprices', anything())).thenReturn(
        of({ data: [{ sku: 'abc' }, { sku: '123' }] as ProductPriceDetailsData[] })
      );
    });

    it('should get product price data when "getProductPrices" is called', done => {
      pricesService.getProductPrices(['abc', '123'], undefined).subscribe(priceDetails => {
        expect(priceDetails).toHaveLength(2);
        verify(apiServiceMock.get(`productprices`, anything())).once();
        expect(capture(apiServiceMock.get).last()).toMatchInlineSnapshot(`
          Array [
            "productprices",
            Object {
              "headers": HttpHeaders {
                "lazyInit": [Function],
                "lazyUpdate": null,
                "normalizedNames": Map {},
              },
              "params": HttpParams {
                "cloneFrom": HttpParams {
                  "cloneFrom": null,
                  "encoder": HttpUrlEncodingCodec {},
                  "map": null,
                  "updates": null,
                },
                "encoder": HttpUrlEncodingCodec {},
                "map": null,
                "updates": Array [
                  Object {
                    "op": "a",
                    "param": "sku",
                    "value": "abc",
                  },
                  Object {
                    "op": "a",
                    "param": "sku",
                    "value": "123",
                  },
                ],
              },
            },
          ]
        `);
        done();
      });
    });

    it('should add customerId to param list when "getProductPrices" is called with customerId', done => {
      pricesService.getProductPrices(['abc', '123'], 'customer').subscribe(() => {
        verify(apiServiceMock.get(`productprices`, anything())).once();
        expect(capture(apiServiceMock.get).last()).toMatchInlineSnapshot(`
          Array [
            "productprices",
            Object {
              "headers": HttpHeaders {
                "lazyInit": [Function],
                "lazyUpdate": null,
                "normalizedNames": Map {},
              },
              "params": HttpParams {
                "cloneFrom": HttpParams {
                  "cloneFrom": null,
                  "encoder": HttpUrlEncodingCodec {},
                  "map": null,
                  "updates": null,
                },
                "encoder": HttpUrlEncodingCodec {},
                "map": null,
                "updates": Array [
                  Object {
                    "op": "a",
                    "param": "sku",
                    "value": "abc",
                  },
                  Object {
                    "op": "a",
                    "param": "sku",
                    "value": "123",
                  },
                  Object {
                    "op": "s",
                    "param": "customerID",
                    "value": "customer",
                  },
                ],
              },
            },
          ]
        `);
        done();
      });
    });
  });
});
