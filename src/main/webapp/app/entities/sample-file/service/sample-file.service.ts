import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISampleFile, getSampleFileIdentifier } from '../sample-file.model';

export type EntityResponseType = HttpResponse<ISampleFile>;
export type EntityArrayResponseType = HttpResponse<ISampleFile[]>;

@Injectable({ providedIn: 'root' })
export class SampleFileService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sample-files');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(sampleFile: ISampleFile): Observable<EntityResponseType> {
    return this.http.post<ISampleFile>(this.resourceUrl, sampleFile, { observe: 'response' });
  }

  update(sampleFile: ISampleFile): Observable<EntityResponseType> {
    return this.http.put<ISampleFile>(`${this.resourceUrl}/${getSampleFileIdentifier(sampleFile) as number}`, sampleFile, {
      observe: 'response',
    });
  }

  partialUpdate(sampleFile: ISampleFile): Observable<EntityResponseType> {
    return this.http.patch<ISampleFile>(`${this.resourceUrl}/${getSampleFileIdentifier(sampleFile) as number}`, sampleFile, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISampleFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISampleFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSampleFileToCollectionIfMissing(
    sampleFileCollection: ISampleFile[],
    ...sampleFilesToCheck: (ISampleFile | null | undefined)[]
  ): ISampleFile[] {
    const sampleFiles: ISampleFile[] = sampleFilesToCheck.filter(isPresent);
    if (sampleFiles.length > 0) {
      const sampleFileCollectionIdentifiers = sampleFileCollection.map(sampleFileItem => getSampleFileIdentifier(sampleFileItem)!);
      const sampleFilesToAdd = sampleFiles.filter(sampleFileItem => {
        const sampleFileIdentifier = getSampleFileIdentifier(sampleFileItem);
        if (sampleFileIdentifier == null || sampleFileCollectionIdentifiers.includes(sampleFileIdentifier)) {
          return false;
        }
        sampleFileCollectionIdentifiers.push(sampleFileIdentifier);
        return true;
      });
      return [...sampleFilesToAdd, ...sampleFileCollection];
    }
    return sampleFileCollection;
  }
}
