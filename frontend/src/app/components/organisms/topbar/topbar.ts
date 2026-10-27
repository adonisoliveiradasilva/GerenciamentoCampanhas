import { Component, inject, computed, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { UserMenu } from '../../molecules/user-menu/user-menu'; 
import { Breadcrumb, IBreadcrumbItem } from '../../molecules/breadcrumb/breadcrumb';
import { UserService } from '../../../domains/user/services/user.service';

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
  
  public userService = inject(UserService);

  breadcrumbs = signal<IBreadcrumbItem[]>([]);
  
  userMenuConfig = computed<MenuItem[]>(() => {
    return [
      {
        label: 'Meu Perfil',
        icon: 'fa-solid fa-user-pen',
        command: () => this.router.navigate(['/perfil'])
      },
      {
        label: 'Sair',
        icon: 'fa-solid fa-right-from-bracket',
        command: () => this.logout()
      }
    ];
  });

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
    }, 0);

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
    localStorage.removeItem('auth_name_override');
    
    this.userService.currentUser.set(null); 
    
    this.router.navigate(['/login']);
  }
}