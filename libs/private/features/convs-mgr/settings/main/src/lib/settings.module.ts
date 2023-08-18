import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// import { MatSelectFilterModule } from 'mat-select-filter';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

// import { SettingsProfileDetailsModule } from '@app/features/settings/user-profile';
// import { SettingsUsersModule } from '@app/features/settings/users';
// import { SettingsPermissionsModule } from '@app/features/settings/permissions';
// import { SettingsOrganisationModule } from '@app/features/settings/organisation-details';
// import { SettingsConfigModule } from '@app/features/settings/configs';

// import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

import { SettingsRouterModule } from './settings.router';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    // MatSelectFilterModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,

    ConvlPageModule,

    // SettingsProfileDetailsModule,
    // SettingsUsersModule,
    // SettingsPermissionsModule,
    // SettingsOrganisationModule,
    // SettingsConfigModule,

    SettingsRouterModule
  ],
  declarations: [
    // SettingsPageComponent
  ],
})
export class SettingsModule {}