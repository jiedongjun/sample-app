import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISample, getSampleIdentifier } from '../sample.model';

export type EntityResponseType = HttpResponse<ISample>;
export type EntityArrayResponseType = HttpResponse<ISample[]>;

@Injectable({ providedIn: 'root' })
export class SampleService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/samples');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(sample: ISample): Observable<EntityResponseType> {
    return this.http.post<ISample>(this.resourceUrl, sample, { observe: 'response' });
  }

  update(sample: ISample): Observable<EntityResponseType> {
    return this.http.put<ISample>(`${this.resourceUrl}/${getSampleIdentifier(sample) as number}`, sample, { observe: 'response' });
  }

  partialUpdate(sample: ISample): Observable<EntityResponseType> {
    return this.http.patch<ISample>(`${this.resourceUrl}/${getSampleIdentifier(sample) as number}`, sample, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISample>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISample[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSampleToCollectionIfMissing(sampleCollection: ISample[], ...samplesToCheck: (ISample | null | undefined)[]): ISample[] {
    const samples: ISample[] = samplesToCheck.filter(isPresent);
    if (samples.length > 0) {
      const sampleCollectionIdentifiers = sampleCollection.map(sampleItem => getSampleIdentifier(sampleItem)!);
      const samplesToAdd = samples.filter(sampleItem => {
        const sampleIdentifier = getSampleIdentifier(sampleItem);
        if (sampleIdentifier == null || sampleCollectionIdentifiers.includes(sampleIdentifier)) {
          return false;
        }
        sampleCollectionIdentifiers.push(sampleIdentifier);
        return true;
      });
      return [...samplesToAdd, ...sampleCollection];
    }
    return sampleCollection;
  }
}
