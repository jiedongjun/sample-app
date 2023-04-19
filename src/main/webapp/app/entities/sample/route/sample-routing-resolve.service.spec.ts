jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISample, Sample } from '../sample.model';
import { SampleService } from '../service/sample.service';

import { SampleRoutingResolveService } from './sample-routing-resolve.service';

describe('Service Tests', () => {
  describe('Sample routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SampleRoutingResolveService;
    let service: SampleService;
    let resultSample: ISample | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SampleRoutingResolveService);
      service = TestBed.inject(SampleService);
      resultSample = undefined;
    });

    describe('resolve', () => {
      it('should return ISample returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSample = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSample).toEqual({ id: 123 });
      });

      it('should return new ISample if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSample = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSample).toEqual(new Sample());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSample = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSample).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
