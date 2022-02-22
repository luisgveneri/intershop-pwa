import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Address Line 2, not required by default
 */
@Injectable()
export class AddressLine2Configuration extends ReusableFormlyFieldConfiguration {
  id = 'addressLine2';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.default_address.street2.label',
        required: false,
      },
    };
  }
}
