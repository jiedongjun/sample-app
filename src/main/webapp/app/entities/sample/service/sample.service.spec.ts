import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISample, Sample } from '../sample.model';

import { SampleService } from './sample.service';

describe('Service Tests', () => {
  describe('Sample Service', () => {
    let service: SampleService;
    let httpMock: HttpTestingController;
    let elemDefault: ISample;
    let expectedResult: ISample | ISample[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SampleService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        duration: 0,
        userId: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Sample', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Sample()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Sample', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            duration: 1,
            userId: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Sample', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            duration: 1,
            userId: 1,
          },
          new Sample()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Sample', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            duration: 1,
            userId: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Sample', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSampleToCollectionIfMissing', () => {
        it('should add a Sample to an empty array', () => {
          const sample: ISample = { id: 123 };
          expectedResult = service.addSampleToCollectionIfMissing([], sample);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sample);
        });

        it('should not add a Sample to an array that contains it', () => {
          const sample: ISample = { id: 123 };
          const sampleCollection: ISample[] = [
            {
              ...sample,
            },
            { id: 456 },
          ];
          expectedResult = service.addSampleToCollectionIfMissing(sampleCollection, sample);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Sample to an array that doesn't contain it", () => {
          const sample: ISample = { id: 123 };
          const sampleCollection: ISample[] = [{ id: 456 }];
          expectedResult = service.addSampleToCollectionIfMissing(sampleCollection, sample);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sample);
        });

        it('should add only unique Sample to an array', () => {
          const sampleArray: ISample[] = [{ id: 123 }, { id: 456 }, { id: 67211 }];
          const sampleCollection: ISample[] = [{ id: 123 }];
          expectedResult = service.addSampleToCollectionIfMissing(sampleCollection, ...sampleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sample: ISample = { id: 123 };
          const sample2: ISample = { id: 456 };
          expectedResult = service.addSampleToCollectionIfMissing([], sample, sample2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sample);
          expect(expectedResult).toContain(sample2);
        });

        it('should accept null and undefined values', () => {
          const sample: ISample = { id: 123 };
          expectedResult = service.addSampleToCollectionIfMissing([], null, sample, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sample);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
