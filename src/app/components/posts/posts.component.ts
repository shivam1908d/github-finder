import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  editingId = signal<number | null>(null);
  message = signal('');
  title = '';
  body = '';

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts().subscribe({
      next: (list) => this.posts.set(list),
      error: () => this.message.set('Posts load nahi ho paye.')
    });
  }

  save() {
    if (!this.title.trim()) return;
    const id = this.editingId();

    if (id === null) {
      this.postsService
        .createPost({ userId: 1, title: this.title, body: this.body })
        .subscribe({
          next: (created) => {
            this.posts.update((list) => [created, ...list]);
            this.message.set(`POST success: server ne id ${created.id} diya.`);
            this.resetForm();
          },
          error: () => this.message.set('POST fail hua.')
        });
    } else {
      this.postsService
        .updatePost({ id, userId: 1, title: this.title, body: this.body })
        .subscribe({
          next: (updated) => {
            this.posts.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
            this.message.set(`PUT success: post ${updated.id} update hua.`);
            this.resetForm();
          },
          error: () => this.message.set('PUT fail hua (naye banaye post ko server me nahi hota).')
        });
    }
  }

  edit(post: Post) {
    this.editingId.set(post.id);
    this.title = post.title;
    this.body = post.body;
  }

  remove(id: number) {
    this.postsService.deletePost(id).subscribe({
      next: () => {
        this.posts.update((list) => list.filter((p) => p.id !== id));
        this.message.set(`DELETE success: post ${id} hata diya.`);
      },
      error: () => this.message.set('DELETE fail hua.')
    });
  }

  resetForm() {
    this.editingId.set(null);
    this.title = '';
    this.body = '';
  }
}