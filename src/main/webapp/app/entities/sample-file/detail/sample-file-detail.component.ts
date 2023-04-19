import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISampleFile } from '../sample-file.model';

@Component({
  selector: 'jhi-sample-file-detail',
  templateUrl: './sample-file-detail.component.html',
})
export class SampleFileDetailComponent implements OnInit {
  sampleFile: ISampleFile | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sampleFile }) => {
      this.sampleFile = sampleFile;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
