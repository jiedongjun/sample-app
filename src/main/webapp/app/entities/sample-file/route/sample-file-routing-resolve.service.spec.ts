jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISampleFile, SampleFile } from '../sample-file.model';
import { SampleFileService } from '../service/sample-file.service';

import { SampleFileRoutingResolveService } from './sample-file-routing-resolve.service';

describe('Service Tests', () => {
  describe('SampleFile routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SampleFileRoutingResolveService;
    let service: SampleFileService;
    let resultSampleFile: ISampleFile | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SampleFileRoutingResolveService);
      service = TestBed.inject(SampleFileService);
      resultSampleFile = undefined;
    });

    describe('resolve', () => {
      it('should return ISampleFile returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSampleFile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSampleFile).toEqual({ id: 123 });
      });

      it('should return new ISampleFile if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSampleFile = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSampleFile).toEqual(new SampleFile());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSampleFile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSampleFile).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
