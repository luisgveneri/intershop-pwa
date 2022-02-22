import { Inject, Injectable, InjectionToken } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { merge } from 'lodash-es';

import { ReusableFormlyFieldConfiguration } from './reusable-formly-field-configuration';

export const REUSABLE_FORMLY_FIELD_CONFIGURATION = new InjectionToken<ReusableFormlyFieldConfiguration>(
  'Reusable Formly Field Configuration'
);

export type ConfigurationGroup = { id: string; shortcutFor: string[] };

export const REUSABLE_FORMLY_FIELD_CONFIGURATION_GROUP = new InjectionToken<ConfigurationGroup>(
  'Reusable Formly Field Configuration Group'
);

@Injectable()
export class ReusableFormlyFieldConfigurationsService {
  constructor(
    @Inject(REUSABLE_FORMLY_FIELD_CONFIGURATION)
    reusableFormlyConfigurations: ReusableFormlyFieldConfiguration[],
    @Inject(REUSABLE_FORMLY_FIELD_CONFIGURATION_GROUP)
    reusableFormlyConfigurationGroups: ConfigurationGroup[]
  ) {
    // create configuration dictionary from array
    this.configurations = reusableFormlyConfigurations?.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}) ?? {};
    // create shortcut dictionary from array
    this.shortcuts =
      reusableFormlyConfigurationGroups?.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.shortcutFor }), {}) ?? {};
  }

  private configurations: Record<string, ReusableFormlyFieldConfiguration>;
  private shortcuts: Record<string, string[]>;

  /**
   * Method for getting a reusable configuration by its id.
   * Uses lodash merge to override properties
   *
   * @param id the id of the reusable configuration
   * @param override an object of modifications that will be made to the standard configuration
   * @returns a reusable formly field configuration that might be modified
   */
  getConfiguration(id: string, override?: Partial<FormlyFieldConfig>): FormlyFieldConfig {
    if (!this.configurations[id]) {
      throw new TypeError(
        `configuration ${id} does not exist. Check whether it's part of the reusable-configurations.module.ts`
      );
    }
    let config = { key: id, ...this.configurations[id].getFieldConfig() };
    if (override) {
      config = merge(config, override);
    }
    return config;
  }

  /**
   * Utility method that makes it easier to get multiple field configurations at once
   *
   * @param group either a group id or an array of ids.
   * @returns an array containing the merged field configurations
   */
  getConfigurationGroup(
    group: string | string[],
    overrides?: Record<string, Partial<FormlyFieldConfig>>
  ): FormlyFieldConfig[] {
    // if group is an array of string, return a merged configuration
    if (Array.isArray(group)) {
      return group.map(id => this.getConfiguration(id, overrides?.[id]));
    }
    // if group is a string, extract the relevant shortcut and recursively call this function with an array of field ids
    if (this.shortcuts[group]) {
      return this.getConfigurationGroup(this.shortcuts[group], overrides);
    }
    throw new TypeError(
      `configuration group ${group} does not exist. Check whether it's part of the reusable-configurations.module.ts`
    );
  }

  getAvailableConfigurationIds() {
    return Object.keys(this.configurations);
  }

  /**
   * Helper method to determine whether a
   *
   * @param id the id of a possible configuration or configuration group
   * @returns true if the configuration or configuration group exists, false otherwise
   */
  configurationExists(id: string) {
    return this.shortcuts[id] || this.configurations[id];
  }
}
