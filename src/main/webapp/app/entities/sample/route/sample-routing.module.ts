import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SampleComponent } from '../list/sample.component';
import { SampleDetailComponent } from '../detail/sample-detail.component';
import { SampleUpdateComponent } from '../update/sample-update.component';
import { SampleRoutingResolveService } from './sample-routing-resolve.service';

const sampleRoute: Routes = [
  {
    path: '',
    component: SampleComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SampleDetailComponent,
    resolve: {
      sample: SampleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SampleUpdateComponent,
    resolve: {
      sample: SampleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SampleUpdateComponent,
    resolve: {
      sample: SampleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sampleRoute)],
  exports: [RouterModule],
})
export class SampleRoutingModule {}
