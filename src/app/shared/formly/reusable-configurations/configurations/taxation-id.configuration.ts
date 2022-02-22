import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Taxation ID, not required by default
 */
@Injectable()
export class TaxationIDConfiguration extends ReusableFormlyFieldConfiguration {
  id = 'taxationID';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.taxation.label',
      },
    };
  }
}
