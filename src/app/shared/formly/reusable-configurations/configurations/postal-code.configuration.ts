import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Postal code, required by default
 */
@Injectable()
export class PostalCodeConfiguration extends ReusableFormlyFieldConfiguration {
  id = 'postalCode';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.default_address.postalcode.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.postalcode.missing.error',
        },
      },
    };
  }
}
