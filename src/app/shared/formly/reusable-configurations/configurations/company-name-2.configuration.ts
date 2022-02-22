import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Company name 2, not required by default
 */
@Injectable()
export class CompanyName2Configuration extends ReusableFormlyFieldConfiguration {
  id = 'companyName2';

  getFieldConfig(): FormlyFieldConfig {
    return {
      key: 'companyName2',
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.company_name_2.label',
        required: false,
      },
    };
  }
}
