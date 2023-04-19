import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISampleFile, SampleFile } from '../sample-file.model';
import { SampleFileService } from '../service/sample-file.service';

@Component({
  selector: 'jhi-sample-file-update',
  templateUrl: './sample-file-update.component.html',
})
export class SampleFileUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    url: [],
    sampleId: [],
  });

  constructor(protected sampleFileService: SampleFileService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sampleFile }) => {
      this.updateForm(sampleFile);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sampleFile = this.createFromForm();
    if (sampleFile.id !== undefined) {
      this.subscribeToSaveResponse(this.sampleFileService.update(sampleFile));
    } else {
      this.subscribeToSaveResponse(this.sampleFileService.create(sampleFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISampleFile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sampleFile: ISampleFile): void {
    this.editForm.patchValue({
      id: sampleFile.id,
      url: sampleFile.url,
      sampleId: sampleFile.sampleId,
    });
  }

  protected createFromForm(): ISampleFile {
    return {
      ...new SampleFile(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      sampleId: this.editForm.get(['sampleId'])!.value,
    };
  }
}
