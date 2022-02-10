import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { PricesService } from 'ish-core/services/prices/prices.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadProductPriceIfNotLoaded, loadProductPrices, loadProductPricesFail, loadProductPricesSuccess } from '.';
import { ProductPricesEffects } from './product-prices.effects';

describe('Products Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductPricesEffects;
  let store$: StoreWithSnapshots;
  let pricesServiceMock: PricesService;

  beforeEach(() => {
    pricesServiceMock = mock(PricesService);
    when(pricesServiceMock.getProductPrices(anything(), anything())).thenCall((skus: string[]) => {
      if (skus.length === 0) {
        return throwError(() => makeHttpError({ message: 'getProductPrices() called with invalid sku' }));
      } else {
        return of(
          skus.map(sku => {
            return { sku } as ProductPriceDetails;
          })
        );
      }
    });

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['serverConfig']),
        ShoppingStoreModule.forTesting('productPrices'),
        CustomerStoreModule.forTesting('user'),
      ],
      providers: [
        ProductPricesEffects,
        provideMockActions(() => actions$),
        { provide: PricesService, useFactory: () => instance(pricesServiceMock) },
        provideStoreSnapshots(),
      ],
    });

    effects = TestBed.inject(ProductPricesEffects);
    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('loadProductPriceIfNotLoaded$', () => {
    it('should dispatch loadProduct action when product with sku is not loaded', () => {
      const sku = 'P123';
      const action = loadProductPriceIfNotLoaded({ sku });
      const completion = loadProductPrices({ skus: [sku] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductPriceIfNotLoaded$).toBeObservable(expected$);
    });

    it('should not dispatch loadProduct action when product is already loaded', () => {
      const sku = 'P123';
      store$.dispatch(loadProductPricesSuccess({ prices: [{ sku } as ProductPriceDetails] }));

      const action = loadProductPriceIfNotLoaded({ sku });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadProductPriceIfNotLoaded$).toBeObservable(expected$);
    });
  });

  describe('loadProductPrices$', () => {
    it('should call the getProductPrices service with skus for loadProductPrices action', done => {
      const skus = ['P123'];
      const action = loadProductPrices({ skus });
      actions$ = of(action);

      effects.loadProductPrices$.subscribe(() => {
        const [skus, customerId] = capture(pricesServiceMock.getProductPrices).last();
        expect(skus).toEqual(skus);
        expect(customerId).toBeUndefined();
        done();
      });
    });

    it('should call the getProductPrices service with skus and customerNo for loadProductPrices action, when user is logged in', done => {
      const customer = { customerNo: 'PC' } as Customer;
      store$.dispatch(loginUserSuccess({ customer }));
      const skus = ['P123'];
      const action = loadProductPrices({ skus });
      actions$ = of(action);

      effects.loadProductPrices$.subscribe(() => {
        const [skus, customerId] = capture(pricesServiceMock.getProductPrices).last();
        expect(skus).toEqual(skus);
        expect(customerId).toEqual(customer.customerNo);
        done();
      });
    });

    it('should map multiple actions to type LoadProductSuccess', () => {
      const action1 = loadProductPrices({ skus: ['a', 'b'] });
      const action2 = loadProductPrices({ skus: ['b', 'c'] });
      const action3 = loadProductPrices({ skus: ['a', 'c', 'd'] });

      const completion = loadProductPricesSuccess({
        prices: [
          { sku: 'a' } as ProductPriceDetails,
          { sku: 'b' } as ProductPriceDetails,
          { sku: 'c' } as ProductPriceDetails,
          { sku: 'd' } as ProductPriceDetails,
        ],
      });
      actions$ = hot('        -a-b-a-c--|', { a: action1, b: action2, c: action3 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.loadProductPrices$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductFail - marbles', () => {
      const skus = [] as string[];
      const action = loadProductPrices({ skus });
      const completion = loadProductPricesFail({
        error: makeHttpError({ message: 'getProductPrices() called with invalid sku' }),
        skus,
      });
      actions$ = hot('        -a-|', { a: action });
      const expected$ = cold('---(c|)', { c: completion });

      expect(effects.loadProductPrices$).toBeObservable(expected$);
    });
  });
});
