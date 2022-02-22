import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Address Line 1 (usually street & number), required by default
 */
@Injectable()
export class AddressLine1Configuration extends ReusableFormlyFieldConfiguration {
  id = 'addressLine1';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.default_address.street.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.address1.missing.error',
        },
      },
    };
  }
}
