import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';

import { loadProductPrices, loadProductPricesFail, loadProductPricesSuccess } from '.';

export const productPriceAdapter = createEntityAdapter<ProductPriceDetails>({
  selectId: product => product.sku,
});

export interface ProductPricesState extends EntityState<ProductPriceDetails> {
  loaded: { [sku: string]: boolean };
}

const initialState: ProductPricesState = productPriceAdapter.getInitialState({
  loaded: {},
});

export const productPricesReducer = createReducer(
  initialState,
  on(loadProductPrices, (state, action) => {
    let loaded = state.loaded;
    action.payload.skus.map(sku => {
      loaded = { ...loaded, [sku]: false };
    });
    return { ...state, loaded };
  }),
  on(loadProductPricesFail, (state, action) => {
    let loaded = state.loaded;
    action.payload.skus.map(sku => {
      loaded = { ...loaded, [sku]: false };
    });
    return { ...state, loaded };
  }),
  on(loadProductPricesSuccess, (state, action) => {
    let loaded = state.loaded;
    action.payload.prices.map(price => {
      loaded = { ...loaded, [price.sku]: true };
    });
    return productPriceAdapter.upsertMany(action.payload.prices, { ...state, loaded });
  })
);
