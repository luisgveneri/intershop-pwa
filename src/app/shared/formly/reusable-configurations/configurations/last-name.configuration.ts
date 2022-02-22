import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * Last name, special characters forbidden and required by default
 */
@Injectable()
export class LastNameConfiguration extends ReusableFormlyFieldConfiguration {
  id = 'lastName';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.default_address.lastname.label',
        required: true,
      },
      validators: {
        validation: [SpecialValidators.noSpecialChars],
      },
      validation: {
        messages: {
          required: 'account.address.lastname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      },
    };
  }
}
