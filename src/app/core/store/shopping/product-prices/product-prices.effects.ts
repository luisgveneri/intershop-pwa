import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { debounceTime, filter, map, mergeMap, toArray, window, withLatestFrom } from 'rxjs/operators';

import { PricesService } from 'ish-core/services/prices/prices.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadProductPriceIfNotLoaded, loadProductPrices, loadProductPricesFail, loadProductPricesSuccess } from '.';
import { getProductPriceLoaded } from './product-prices.selectors';

@Injectable()
export class ProductPricesEffects {
  constructor(private actions$: Actions, private store: Store, private pricesService: PricesService) {}

  loadProductPriceIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductPriceIfNotLoaded),
      mapToPayloadProperty('sku'),
      mergeMap(sku => of(sku).pipe(withLatestFrom(this.store.pipe(select(getProductPriceLoaded(sku)))))),
      filter(([, loaded]) => !loaded),
      map(([sku]) => loadProductPrices({ skus: [sku] }))
    )
  );

  loadProductPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductPrices),
      mapToPayloadProperty('skus'),
      whenTruthy(),
      window(this.actions$.pipe(ofType(loadProductPrices), debounceTime(500))),
      mergeMap(window$ =>
        window$.pipe(
          toArray(),
          filter(skuArrays => skuArrays.length !== 0), // array should have entries for following map operators
          map(skuArrays => skuArrays.reduce((prev, cur) => prev.concat(cur))), // map two dimensional array list to one dimension
          map(skus => Array.from(new Set(skus))) // remove duplicated entries from sku list
        )
      ),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      mergeMap(([skus, customer]) =>
        this.pricesService.getProductPrices(skus, customer?.customerNo).pipe(
          map(prices => loadProductPricesSuccess({ prices })),
          mapErrorToAction(loadProductPricesFail, { skus })
        )
      )
    )
  );
}
