import { Component, inject, computed, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { UserMenu } from '../../molecules/user-menu/user-menu'; 
import { Breadcrumb, IBreadcrumbItem } from '../../molecules/breadcrumb/breadcrumb';

@Component({
  selector: 'lumen-topbar',
  standalone: true,
  imports: [UserMenu, Breadcrumb],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Topbar implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs = signal<IBreadcrumbItem[]>([]);

  currentUser = signal({
    id: '123',
    name: 'Gestor Administrativo',
    email: 'gestor@doacoes.com',
  });

  userMenuConfig = computed<MenuItem[]>(() => {
    return [
      {
        label: 'Sair',
        icon: 'fa-solid fa-right-from-bracket',
        command: () => this.logout()
      }
    ];
  });

  ngOnInit() {
    this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
    });
  }

  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumbItem[] = []): IBreadcrumbItem[] {
    let nextUrl = url;
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        nextUrl += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url: nextUrl });
      }

      return this.buildBreadcrumb(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}