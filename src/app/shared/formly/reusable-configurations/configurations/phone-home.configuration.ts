import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Phone, not required by default
 */
@Injectable()
export class PhoneHomeConfiguration extends ReusableFormlyFieldConfiguration {
  id = 'phoneHome';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-phone-field',
      templateOptions: {
        label: 'account.profile.phone.label',
        required: false,
      },
    };
  }
}
