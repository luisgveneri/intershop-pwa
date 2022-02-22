import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { registerReusabilityExtensionAndTypes } from './config-reusability.extension';
import { AddressLine1Configuration } from './configurations/address-line-1.configuration';
import { AddressLine2Configuration } from './configurations/address-line-2.configuration';
import { CityConfiguration } from './configurations/city.configuration';
import { CompanyName1Configuration } from './configurations/company-name-1.configuration';
import { CompanyName2Configuration } from './configurations/company-name-2.configuration';
import { FirstNameConfiguration } from './configurations/first-name.configuration';
import { LastNameConfiguration } from './configurations/last-name.configuration';
import { PhoneHomeConfiguration } from './configurations/phone-home.configuration';
import { PostalCodeConfiguration } from './configurations/postal-code.configuration';
import { TaxationIDConfiguration } from './configurations/taxation-id.configuration';
import { TitleConfiguration } from './configurations/title.configuration';
import {
  REUSABLE_FORMLY_FIELD_CONFIGURATION,
  ReusableFormlyFieldConfigurationsService,
  REUSABLE_FORMLY_FIELD_CONFIGURATION_GROUP,
} from './reusable-formly-field-configurations.service';

@NgModule({
  imports: [CommonModule, FormsSharedModule, FormlyBaseModule.forChild({})],
  providers: [
    ReusableFormlyFieldConfigurationsService,
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: TitleConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: FirstNameConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: LastNameConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: PhoneHomeConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: CompanyName1Configuration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: CompanyName2Configuration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: TaxationIDConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: AddressLine1Configuration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: AddressLine2Configuration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: PostalCodeConfiguration, multi: true },
    { provide: REUSABLE_FORMLY_FIELD_CONFIGURATION, useClass: CityConfiguration, multi: true },
    {
      provide: REUSABLE_FORMLY_FIELD_CONFIGURATION_GROUP,
      useValue: { id: 'personalInfo', shortcutFor: ['title', 'firstName', 'lastName', 'phoneHome'] },
      multi: true,
    },
    {
      provide: REUSABLE_FORMLY_FIELD_CONFIGURATION_GROUP,
      useValue: { id: 'companyInfo', shortcutFor: ['companyName1', 'companyName2', 'taxationID'] },
      multi: true,
    },
    {
      provide: FORMLY_CONFIG,
      useFactory: registerReusabilityExtensionAndTypes,
      deps: [ReusableFormlyFieldConfigurationsService],
      multi: true,
    },
  ],
})
export class ReusableConfigurationsModule {}
