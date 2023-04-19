import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SampleComponent } from './list/sample.component';
import { SampleDetailComponent } from './detail/sample-detail.component';
import { SampleUpdateComponent } from './update/sample-update.component';
import { SampleDeleteDialogComponent } from './delete/sample-delete-dialog.component';
import { SampleRoutingModule } from './route/sample-routing.module';

@NgModule({
  imports: [SharedModule, SampleRoutingModule],
  declarations: [SampleComponent, SampleDetailComponent, SampleUpdateComponent, SampleDeleteDialogComponent],
  entryComponents: [SampleDeleteDialogComponent],
})
export class SampleModule {}
