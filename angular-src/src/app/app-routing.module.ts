import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnotationViewComponent } from './components/annotation-view/annotation-view.component';
import { AnnotateComponent } from './components/annotate/annotate.component';
import {CreateClassComponent} from './components/create-class/create-class.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ActivityComponent } from './components/activity/activity.component';
import { GroupComponent } from './components/group/group.component';


import {AuthGuard} from './guards/auth.guards';

const routes: Routes = [
  {path:'', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'view/annotations/:email/:activityname/:taskname', component: AnnotationViewComponent, canActivate:[AuthGuard]},
  {path:'annotate/:activitytype/:activityname/:title', component: AnnotateComponent, canActivate:[AuthGuard]},
  {path:'createclass', component: CreateClassComponent, canActivate:[AuthGuard]},
  {path:'classroom/:classname', component: ClassroomComponent, canActivate:[AuthGuard]},
  {path:'activity/:activityname', component: ActivityComponent, canActivate:[AuthGuard]},
  {path:'group/:activityname', component: GroupComponent, canActivate:[AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'},)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
