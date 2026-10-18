import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { PostsComponent } from './components/posts/posts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'posts', component: PostsComponent },
  { path: '**', redirectTo: 'search' }
];