jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SampleFileService } from '../service/sample-file.service';
import { ISampleFile, SampleFile } from '../sample-file.model';

import { SampleFileUpdateComponent } from './sample-file-update.component';

describe('Component Tests', () => {
  describe('SampleFile Management Update Component', () => {
    let comp: SampleFileUpdateComponent;
    let fixture: ComponentFixture<SampleFileUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sampleFileService: SampleFileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SampleFileUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SampleFileUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SampleFileUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sampleFileService = TestBed.inject(SampleFileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const sampleFile: ISampleFile = { id: 456 };

        activatedRoute.data = of({ sampleFile });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sampleFile));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sampleFile = { id: 123 };
        spyOn(sampleFileService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sampleFile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sampleFile }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sampleFileService.update).toHaveBeenCalledWith(sampleFile);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sampleFile = new SampleFile();
        spyOn(sampleFileService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sampleFile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sampleFile }));
        saveSubject.complete();

        // THEN
        expect(sampleFileService.create).toHaveBeenCalledWith(sampleFile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sampleFile = { id: 123 };
        spyOn(sampleFileService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sampleFile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sampleFileService.update).toHaveBeenCalledWith(sampleFile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
