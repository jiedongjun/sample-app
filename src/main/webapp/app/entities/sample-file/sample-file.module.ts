import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SampleFileComponent } from './list/sample-file.component';
import { SampleFileDetailComponent } from './detail/sample-file-detail.component';
import { SampleFileUpdateComponent } from './update/sample-file-update.component';
import { SampleFileDeleteDialogComponent } from './delete/sample-file-delete-dialog.component';
import { SampleFileRoutingModule } from './route/sample-file-routing.module';

@NgModule({
  imports: [SharedModule, SampleFileRoutingModule],
  declarations: [SampleFileComponent, SampleFileDetailComponent, SampleFileUpdateComponent, SampleFileDeleteDialogComponent],
  entryComponents: [SampleFileDeleteDialogComponent],
})
export class SampleFileModule {}
