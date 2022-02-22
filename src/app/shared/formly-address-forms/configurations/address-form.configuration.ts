import { FormlyFieldConfig } from '@ngx-formly/core';

import { Address } from 'ish-core/models/address/address.model';

/*
 * Abstract class that valid address configurations have to extend.
 * The countryCode, businessCustomer and shortForm properties will be set by the AddressFormConfigurationProvider
 */
export abstract class AddressFormConfiguration {
  countryCode = 'default';
  businessCustomer = false;
  shortForm = false;

  abstract getFieldConfiguration(countryCode?: string): FormlyFieldConfig[];

  abstract getModel(model?: Partial<Address>): Partial<Address>;
}
