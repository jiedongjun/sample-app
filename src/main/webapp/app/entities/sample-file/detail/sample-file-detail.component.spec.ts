import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SampleFileDetailComponent } from './sample-file-detail.component';

describe('Component Tests', () => {
  describe('SampleFile Management Detail Component', () => {
    let comp: SampleFileDetailComponent;
    let fixture: ComponentFixture<SampleFileDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SampleFileDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sampleFile: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SampleFileDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SampleFileDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sampleFile on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sampleFile).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
