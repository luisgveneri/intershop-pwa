import { FormlyFieldConfig } from '@ngx-formly/core';

export abstract class ReusableFormlyFieldConfiguration {
  id: string;

  abstract getFieldConfig(): FormlyFieldConfig;
}
