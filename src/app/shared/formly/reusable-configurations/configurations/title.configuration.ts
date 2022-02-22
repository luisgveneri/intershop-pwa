import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ReusableFormlyFieldConfiguration } from 'ish-shared/formly/reusable-configurations/reusable-formly-field-configuration';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

/**
 * Title/Salutation, automatically extracts options from FormsService, not required by default
 */
@Injectable()
export class TitleConfiguration extends ReusableFormlyFieldConfiguration {
  constructor(private formsService: FormsService) {
    super();
  }
  id = 'title';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-select-field',
      templateOptions: {
        label: 'account.default_address.title.label',
        placeholder: 'account.option.select.text',
        options: this.formsService.getSalutationOptions(),
      },
    };
  }
}
