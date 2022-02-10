import { TestBed, fakeAsync } from '@angular/core/testing';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadProductPricesSuccess } from '.';
import { getProductPrice, getProductPriceLoaded } from './product-prices.selectors';

describe('Product Price Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['serverConfig']),
        ShoppingStoreModule.forTesting('productPrices'),
        CustomerStoreModule.forTesting('user'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any filters when used', () => {
      expect(getProductPrice('sku')(store$.state)).toBeUndefined();
      expect(getProductPriceLoaded('sku')(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadProductPriceSuccess state', () => {
    const priceDetails: ProductPriceDetails = { sku: 'sku' } as ProductPriceDetails;
    beforeEach(() => {
      store$.dispatch(loadProductPricesSuccess({ prices: [priceDetails] }));
    });
    it('should add the filter to the state', fakeAsync(() => {
      expect(getProductPrice('sku')(store$.state)).toEqual(priceDetails);
      expect(getProductPriceLoaded('sku')(store$.state)).toBeTrue();
    }));
  });
});
