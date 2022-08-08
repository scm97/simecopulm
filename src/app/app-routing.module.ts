import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { StudentGuard } from './guards/student.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { AssignCaseComponent } from './web/assign-case/assign-case.component';
import { EvaluationListComponent } from './web/evaluation-list/evaluation-list.component';
import { EvaluationComponent } from './web/evaluation/evaluation.component';
import { IndexComponent } from './web/index/index.component';
import { LogInComponent } from './web/index/log-in/log-in.component';
import { SignUpComponent } from './web/index/sign-up/sign-up.component';
import { NotfoundComponent } from './web/notfound/notfound.component';
import { ProfileComponent } from './web/profile/profile.component';
import { RecordCoordComponent } from './web/record-coord/record-coord.component';
import { StudentComponent } from './web/student/student.component';
import { TeacherComponent } from './web/teacher/teacher.component';
import { TrainingComponent } from './web/training/training.component';
import { TreatmentComponent } from './web/treatment/treatment.component';
import { UploadComponent } from './web/upload/upload.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent,canActivate:[LoginGuard]},
  {path: 'signup', component: SignUpComponent ,canActivate:[LoginGuard]},
  {
  path: 'login', component: IndexComponent, canActivate:[LoginGuard],
  children: [{ path: '', component: LogInComponent }]
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path:'teacher', component: TeacherComponent,canActivate:[TeacherGuard]},
  {path:'student', component: StudentComponent,canActivate:[StudentGuard]},
  {path:'upload-case', component: UploadComponent,canActivate:[TeacherGuard]},
  {path:'record-coord', component: RecordCoordComponent,canActivate:[TeacherGuard]},
  {path:'profile', component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'assign-cases', component: AssignCaseComponent,canActivate:[TeacherGuard]},
  {path:'training', component:TrainingComponent,canActivate:[StudentGuard]},
  {path:'treatment', component:TreatmentComponent,canActivate:[StudentGuard]},
  {path:'evaluation', component:EvaluationComponent},
  {path:'evaluation-list', component:EvaluationListComponent},
  {path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
