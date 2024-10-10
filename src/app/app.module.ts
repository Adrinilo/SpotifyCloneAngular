import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { AuthGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LibraryComponent } from './components/library/library.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard]  },
  { path: 'playlists/tracks', component: TracksComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CallbackComponent,
    PlaylistsComponent,
    TracksComponent,
    NavbarComponent,
    LibraryComponent,
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
