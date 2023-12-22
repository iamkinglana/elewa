import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const STORIES_ROUTES: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: ':id',
    loadChildren: () => import('@app/features/convs-mgr/stories/editor').then(m => m.ConvlStoryEditorModule),
    canActivate: [IsLoggedInGuard],
    canLoad: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(STORIES_ROUTES)],
  exports: [RouterModule]
})
export class ConvsMgrLessonsRouterModule { }
