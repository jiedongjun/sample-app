jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SampleService } from '../service/sample.service';
import { ISample, Sample } from '../sample.model';

import { SampleUpdateComponent } from './sample-update.component';

describe('Component Tests', () => {
  describe('Sample Management Update Component', () => {
    let comp: SampleUpdateComponent;
    let fixture: ComponentFixture<SampleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sampleService: SampleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SampleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SampleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SampleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sampleService = TestBed.inject(SampleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const sample: ISample = { id: 456 };

        activatedRoute.data = of({ sample });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sample));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sample = { id: 123 };
        spyOn(sampleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sample });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sample }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sampleService.update).toHaveBeenCalledWith(sample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sample = new Sample();
        spyOn(sampleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sample });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sample }));
        saveSubject.complete();

        // THEN
        expect(sampleService.create).toHaveBeenCalledWith(sample);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sample = { id: 123 };
        spyOn(sampleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sample });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sampleService.update).toHaveBeenCalledWith(sample);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
