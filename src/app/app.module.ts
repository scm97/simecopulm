import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { StudentGuard } from './guards/student.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { LoginGuard } from './guards/login.guard';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './web/index/index.component';
import { LogInComponent } from './web/index/log-in/log-in.component';
import { SignUpComponent } from './web/index/sign-up/sign-up.component';
import { TeacherComponent } from './web/teacher/teacher.component';
import { StudentComponent } from './web/student/student.component';
import { UploadComponent } from './web/upload/upload.component';
import { TreatmentComponent } from './web/treatment/treatment.component';
import { RecordCoordComponent } from './web/record-coord/record-coord.component';
import { ProfileComponent } from './web/profile/profile.component';
import { TrainingComponent } from './web/training/training.component';
import { AssignCaseComponent } from './web/assign-case/assign-case.component';
import { EvaluationComponent } from './web/evaluation/evaluation.component';
import { EvaluationListComponent } from './web/evaluation-list/evaluation-list.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon"; 
import {MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LogInComponent,
    SignUpComponent,
    TeacherComponent,
    StudentComponent,
    UploadComponent,
    RecordCoordComponent,
    ProfileComponent,
    AssignCaseComponent,
    TrainingComponent,
    TreatmentComponent,
    EvaluationComponent,
    EvaluationListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgChartsModule,
    
    MatCardModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    DragDropModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [AuthService,AuthGuard,TeacherGuard,StudentGuard, LoginGuard,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'},  
  }
  ],
  entryComponents:[MatDialogModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
