import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISampleFile } from '../sample-file.model';
import { SampleFileService } from '../service/sample-file.service';

@Component({
  templateUrl: './sample-file-delete-dialog.component.html',
})
export class SampleFileDeleteDialogComponent {
  sampleFile?: ISampleFile;

  constructor(protected sampleFileService: SampleFileService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sampleFileService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
