import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sample',
        data: { pageTitle: 'sampleApp.sample.home.title' },
        loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule),
      },
      {
        path: 'sample-file',
        data: { pageTitle: 'sampleApp.sampleFile.home.title' },
        loadChildren: () => import('./sample-file/sample-file.module').then(m => m.SampleFileModule),
      },
      {
        path: 'sample-info',
        data: { pageTitle: 'sampleApp.sampleInfo.home.title' },
        loadChildren: () => import('./sample-info/sample-info.module').then(m => m.SampleInfoModule),
      },
      {
        path: 'stample-file',
        data: { pageTitle: 'sampleApp.stampleFile.home.title' },
        loadChildren: () => import('./stample-file/stample-file.module').then(m => m.StampleFileModule),
      },
      {
        path: 'stample',
        data: { pageTitle: 'sampleApp.stample.home.title' },
        loadChildren: () => import('./stample/stample.module').then(m => m.StampleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
