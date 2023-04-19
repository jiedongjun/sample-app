import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISample, Sample } from '../sample.model';
import { SampleService } from '../service/sample.service';

@Component({
  selector: 'jhi-sample-update',
  templateUrl: './sample-update.component.html',
})
export class SampleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    duration: [],
    userId: [],
  });

  constructor(protected sampleService: SampleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sample }) => {
      this.updateForm(sample);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sample = this.createFromForm();
    if (sample.id !== undefined) {
      this.subscribeToSaveResponse(this.sampleService.update(sample));
    } else {
      this.subscribeToSaveResponse(this.sampleService.create(sample));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISample>>): void {
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

  protected updateForm(sample: ISample): void {
    this.editForm.patchValue({
      id: sample.id,
      name: sample.name,
      duration: sample.duration,
      userId: sample.userId,
    });
  }

  protected createFromForm(): ISample {
    return {
      ...new Sample(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      userId: this.editForm.get(['userId'])!.value,
    };
  }
}
