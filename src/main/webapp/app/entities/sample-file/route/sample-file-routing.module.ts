import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SampleFileComponent } from '../list/sample-file.component';
import { SampleFileDetailComponent } from '../detail/sample-file-detail.component';
import { SampleFileUpdateComponent } from '../update/sample-file-update.component';
import { SampleFileRoutingResolveService } from './sample-file-routing-resolve.service';

const sampleFileRoute: Routes = [
  {
    path: '',
    component: SampleFileComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SampleFileDetailComponent,
    resolve: {
      sampleFile: SampleFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SampleFileUpdateComponent,
    resolve: {
      sampleFile: SampleFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SampleFileUpdateComponent,
    resolve: {
      sampleFile: SampleFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sampleFileRoute)],
  exports: [RouterModule],
})
export class SampleFileRoutingModule {}
