import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';

/**
 * Company Name 1, required by default
 */
@Injectable()
export class CompanyName1Configuration extends ReusableFormlyFieldConfiguration {
  id = 'companyName1';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.address.company_name.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'account.address.company_name.error.required',
        },
      },
    };
  }
}
