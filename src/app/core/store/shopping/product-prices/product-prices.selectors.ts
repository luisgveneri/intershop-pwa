import { createSelector } from '@ngrx/store';

import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productPriceAdapter } from './product-prices.reducer';

const getProductPricesState = createSelector(getShoppingState, (state: ShoppingState) => state.productPrices);

const { selectEntities } = productPriceAdapter.getSelectors(getProductPricesState);

export const getProductPrice = (sku: string) => createSelector(selectEntities, entities => entities[sku]);

export const getProductPriceLoaded = (sku: string) => createSelector(getProductPricesState, state => state.loaded[sku]);
