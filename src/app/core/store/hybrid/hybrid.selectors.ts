import { createSelector } from '@ngrx/store';

import {
  getConfigurationState,
  getCurrentCurrency,
  getCurrentLocale,
  getICMApplication,
} from 'ish-core/store/core/configuration';

import { ICM_WEB_URL } from '../../../../hybrid/default-url-mapping-table';

export const getICMWebURL = createSelector(
  getConfigurationState,
  getCurrentLocale,
  getCurrentCurrency,
  getICMApplication,
  (state, locale, currency, application) =>
    ICM_WEB_URL.replace('$<channel>', state.channel)
      .replace('$<lang>', locale.lang)
      .replace('$<application>', application)
      .replace('$<currency>', currency)
);
