import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { omit } from 'lodash-es';

import { ReusableFormlyFieldConfigurationsService } from './reusable-formly-field-configurations.service';

class ConfigReusabilityExtension implements FormlyExtension {
  constructor(
    private reusableFormlyFieldConfigurationsService: ReusableFormlyFieldConfigurationsService,
    availableConfigIds: string[]
  ) {
    this.configIds = new Set(availableConfigIds);
  }

  private configIds: Set<string>;

  prePopulate(field: FormlyFieldConfig): void {
    const configId = new RegExp(/^#(.+)$/).exec(field.type)?.[1];
    if (this.configIds.has(configId)) {
      const override = omit(field, 'type');
      const config = this.reusableFormlyFieldConfigurationsService.getConfiguration(configId, override);
      // eslint-disable-next-line ban/ban
      Object.assign(field, config);
    }
  }
}

export function registerReusabilityExtensionAndTypes(
  reusableFormlyFieldConfigurationsService: ReusableFormlyFieldConfigurationsService
) {
  const availableConfigIds = reusableFormlyFieldConfigurationsService.getAvailableConfigurationIds();
  return {
    types: [...availableConfigIds.map(id => ({ name: `#${id}` }))],
    extensions: [
      {
        name: 'configReusability',
        extension: new ConfigReusabilityExtension(reusableFormlyFieldConfigurationsService, availableConfigIds),
      },
    ],
  };
}
