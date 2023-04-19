import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISampleFile, SampleFile } from '../sample-file.model';
import { SampleFileService } from '../service/sample-file.service';

@Injectable({ providedIn: 'root' })
export class SampleFileRoutingResolveService implements Resolve<ISampleFile> {
  constructor(protected service: SampleFileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISampleFile> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sampleFile: HttpResponse<SampleFile>) => {
          if (sampleFile.body) {
            return of(sampleFile.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SampleFile());
  }
}
