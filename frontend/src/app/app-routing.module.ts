import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import {RegisterComponent} from 'src/components/register/register.component';
import { HomeComponent } from 'src/components/home/home.component'; 
import { GameComponent } from 'src/components/game/game.component';
import { ProfileComponent } from 'src/components/profile/profile.component';
import { AuthGuard } from './auth-guard.service';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'game', component: GameComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
