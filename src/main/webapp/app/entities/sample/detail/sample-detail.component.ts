import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISample } from '../sample.model';

@Component({
  selector: 'jhi-sample-detail',
  templateUrl: './sample-detail.component.html',
})
export class SampleDetailComponent implements OnInit {
  sample: ISample | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sample }) => {
      this.sample = sample;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
