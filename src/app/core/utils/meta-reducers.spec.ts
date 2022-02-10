import { Action, ActionReducerMap, combineReducers } from '@ngrx/store';
import { identity } from 'rxjs';

import { CustomerUserType } from 'ish-core/models/customer/customer.model';
import { loginUserSuccess, logoutUser } from 'ish-core/store/customer/user';
import {
  ProductPricesState,
  productPricesReducer,
  productPriceAdapter,
} from 'ish-core/store/shopping/product-prices/product-prices.reducer';
import { ShoppingState } from 'ish-core/store/shopping/shopping-store';

import { resetOnLogoutMeta, resetPersonalizedDataMeta } from './meta-reducers';

describe('Meta Reducers', () => {
  describe('resetPersonalizedDataMeta', () => {
    const state: ShoppingState = {
      productPrices: {
        ids: ['sku'],
        entities: {
          sku: {
            sku: 'sku',
            prices: {
              salePrice: { currency: 'EUR', gross: 2, net: 1, type: 'PriceItem' },
              listPrice: { currency: 'EUR', gross: 2, net: 1, type: 'PriceItem' },
            },
          },
        },
        loaded: { sku: true },
      } as ProductPricesState,
    } as ShoppingState;

    const reducer = combineReducers({ productPrices: productPricesReducer } as ActionReducerMap<ShoppingState>);

    it('should reset state when reducing LogoutUser action', () => {
      const result = resetPersonalizedDataMeta(identity)(state, logoutUser());
      expect(result.productPrices).toBeUndefined();
    });

    it('should reset state when reducing SetPGID action', () => {
      const result = resetPersonalizedDataMeta(identity)(
        state,
        loginUserSuccess({ customer: { customerNo: 'user' } } as CustomerUserType)
      );
      expect(result.productPrices).toBeUndefined();
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetPersonalizedDataMeta(reducer)(state, logoutUser());
      expect(result).toEqual({
        productPrices: productPriceAdapter.getInitialState({
          loaded: {},
        }),
      });
    });

    it('should reset and delegate to reducer initial state when reducing SetPGID action', () => {
      const result = resetPersonalizedDataMeta(reducer)(
        state,
        loginUserSuccess({ customer: { customerNo: 'user' } } as CustomerUserType)
      );
      expect(result).toEqual({
        productPrices: productPriceAdapter.getInitialState({
          loaded: {},
        }),
      });
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetPersonalizedDataMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
    });
  });

  describe('resetOnLogoutMeta', () => {
    const state = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const reducer = combineReducers({
      a: (s = 'initialA') => s,
      b: (s = 'initialB') => s,
    });

    it('should reset state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(identity)(state, logoutUser());
      expect(result).toBeUndefined();
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(reducer)(state, logoutUser());
      expect(result).toEqual({ a: 'initialA', b: 'initialB' });
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetOnLogoutMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
    });
  });
});
