import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SampleDetailComponent } from './sample-detail.component';

describe('Component Tests', () => {
  describe('Sample Management Detail Component', () => {
    let comp: SampleDetailComponent;
    let fixture: ComponentFixture<SampleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SampleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sample: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SampleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SampleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sample on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sample).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
