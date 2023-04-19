import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISampleFile, SampleFile } from '../sample-file.model';

import { SampleFileService } from './sample-file.service';

describe('Service Tests', () => {
  describe('SampleFile Service', () => {
    let service: SampleFileService;
    let httpMock: HttpTestingController;
    let elemDefault: ISampleFile;
    let expectedResult: ISampleFile | ISampleFile[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SampleFileService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        url: 'AAAAAAA',
        sampleId: 0,
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

      it('should create a SampleFile', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SampleFile()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SampleFile', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            url: 'BBBBBB',
            sampleId: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SampleFile', () => {
        const patchObject = Object.assign(
          {
            url: 'BBBBBB',
            sampleId: 1,
          },
          new SampleFile()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SampleFile', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            url: 'BBBBBB',
            sampleId: 1,
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

      it('should delete a SampleFile', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSampleFileToCollectionIfMissing', () => {
        it('should add a SampleFile to an empty array', () => {
          const sampleFile: ISampleFile = { id: 123 };
          expectedResult = service.addSampleFileToCollectionIfMissing([], sampleFile);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sampleFile);
        });

        it('should not add a SampleFile to an array that contains it', () => {
          const sampleFile: ISampleFile = { id: 123 };
          const sampleFileCollection: ISampleFile[] = [
            {
              ...sampleFile,
            },
            { id: 456 },
          ];
          expectedResult = service.addSampleFileToCollectionIfMissing(sampleFileCollection, sampleFile);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SampleFile to an array that doesn't contain it", () => {
          const sampleFile: ISampleFile = { id: 123 };
          const sampleFileCollection: ISampleFile[] = [{ id: 456 }];
          expectedResult = service.addSampleFileToCollectionIfMissing(sampleFileCollection, sampleFile);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sampleFile);
        });

        it('should add only unique SampleFile to an array', () => {
          const sampleFileArray: ISampleFile[] = [{ id: 123 }, { id: 456 }, { id: 97788 }];
          const sampleFileCollection: ISampleFile[] = [{ id: 123 }];
          expectedResult = service.addSampleFileToCollectionIfMissing(sampleFileCollection, ...sampleFileArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sampleFile: ISampleFile = { id: 123 };
          const sampleFile2: ISampleFile = { id: 456 };
          expectedResult = service.addSampleFileToCollectionIfMissing([], sampleFile, sampleFile2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sampleFile);
          expect(expectedResult).toContain(sampleFile2);
        });

        it('should accept null and undefined values', () => {
          const sampleFile: ISampleFile = { id: 123 };
          expectedResult = service.addSampleFileToCollectionIfMissing([], null, sampleFile, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sampleFile);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
