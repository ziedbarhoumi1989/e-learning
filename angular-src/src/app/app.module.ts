import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent, HelpDialogComponent } from './components/dashboard/dashboard.component';
import { AnnotateComponent, AnnotateTaskDialogComponent, AnnotateConfirmDialogComponent, AnnotateSubmittedDialogComponent } from './components/annotate/annotate.component';
import {CreateClassComponent} from './components/create-class/create-class.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ValidateService} from './services/validate.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthService} from './services/auth.service';
import {ClassService} from './services/class.service';
import {TaskService} from './services/task.service';
import { NavbarService } from './services/navbar.service';
import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {AuthGuard} from './guards/auth.guards';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatExpansionModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { FileDropModule } from 'ngx-file-drop';
import { FlipModule } from 'ngx-flip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import * as $ from 'jquery';
import { LayoutModule } from '@angular/cdk/layout';
import { ActivityComponent, ImagePreviewComponent } from './components/activity/activity.component';
import {MatMenuModule} from '@angular/material/menu';
import { NgxEditorModule } from 'ngx-editor';
import {MatTableModule} from '@angular/material/table';
import { GroupComponent, GroupImagePreviewComponent, ImageHelpDialogComponent } from './components/group/group.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LightboxModule } from 'angular2-lightbox';
import { AnnotationViewComponent, ViewTaskDialogComponent } from './components/annotation-view/annotation-view.component';
import {MatBadgeModule} from '@angular/material/badge';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
window['$'] = window['jQuery'] = $;


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    AnnotateComponent,
    AnnotateTaskDialogComponent,
    AnnotateConfirmDialogComponent,
    AnnotateSubmittedDialogComponent,
    GroupImagePreviewComponent,
    CreateClassComponent,
    ClassroomComponent,
    ActivityComponent,
    ImagePreviewComponent,
    GroupComponent,
    AnnotationViewComponent,
    ViewTaskDialogComponent,
    ImageHelpDialogComponent,
    HelpDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    HttpModule,
    HttpClientModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatTreeModule,
    NgbModule.forRoot(),
    MatDialogModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ModalModule.forRoot(),
    FileDropModule,
    PopoverModule.forRoot(),
    MatGridListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    FlexLayoutModule,
    MatTabsModule,
    MatCardModule,
    MatMenuModule,
    NgxEditorModule,
    MatTableModule,
    MatTooltipModule,
    LightboxModule,
    FlipModule,
    MatBadgeModule,
    ScrollDispatchModule
    
  ],
  entryComponents:[
  AnnotateTaskDialogComponent,
  AnnotateConfirmDialogComponent,
  AnnotateSubmittedDialogComponent,
  ImagePreviewComponent,
  GroupImagePreviewComponent,
  ViewTaskDialogComponent,
  ImageHelpDialogComponent,
  HelpDialogComponent
  ],
  providers: [
  ValidateService, 
  AuthService,
  ClassService,
  AuthGuard,
  BsModalService,
  TaskService,
  NavbarService
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
