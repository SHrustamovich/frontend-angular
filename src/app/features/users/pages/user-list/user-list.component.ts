import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {User, UserResponse } from '../../../../core/models/user.model';
import { UserTableComponent } from '../../components/user-table/user-table.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, UserTableComponent],
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  loading = true;

  ordering: string | null = null;

  page = 1;
  pageSize = 10;
  total = 0;
  pagesCount = 0;

  ageFrom: number | null = null;
  ageTo: number | null = null;

  countries: { code: string; name: string }[] = [
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'US', name: 'United States' },
    { code: 'RU', name: 'Russia' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'TR', name: 'Turkey' },
  ];

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => this.applyFilter(term));
  }

  private loadUsers() {
    this.loading = true;
    this.userService
      .getUsers({
        page: this.page,
        pageSize: this.pageSize,
        search: this.searchTerm,
        ordering: this.ordering || undefined,
        ageFrom: this.ageFrom || undefined,
        ageTo: this.ageTo || undefined,
      })
      .subscribe({
        next: (res: UserResponse) => {
          this.users = res.data;
          this.allUsers = res.data;
          this.page = res.page;
          this.pageSize = res.pageSize;
          this.total = res.total;
          this.pagesCount = res.pagesCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Xatolik:', err);
          this.loading = false;
        },
      });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input?.value ?? '';
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  onSearchEnter() {
    this.applyFilter(this.searchTerm);
  }

  private applyFilter(query: string) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      this.users = [...this.allUsers];
      return;
    }

    this.users = this.allUsers.filter((u) => {
      const username = u?.username?.toLowerCase() || '';
      const fullName = `${u?.firstName || ''} ${u?.lastName || ''}`.toLowerCase().trim();
      return username.includes(q) || fullName.includes(q);
    });
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.pagesCount) return;
    this.page = newPage;
    this.loadUsers();
  }

  changePageSize(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(value);
    this.loadUsers();
  }

  applyAgeFilter() {
    this.page = 1; // yangi filterda 1-betdan boshlash u-n
    this.loadUsers();
  }

  get showingFrom(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    const to = this.page * this.pageSize;
    return to > this.total ? this.total : to;
  }

  generatePagination(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.pagesCount <= 7) {
      for (let i = 1; i <= this.pagesCount; i++) {
        pages.push(i);
      }
    } else {
      if (this.page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', this.pagesCount);
      } else if (this.page >= this.pagesCount - 3) {
        pages.push(
          1,
          '...',
          this.pagesCount - 4,
          this.pagesCount - 3,
          this.pagesCount - 2,
          this.pagesCount - 1,
          this.pagesCount
        );
      }
      // o'rtasiga qo'yiladigan sonlar u-n yozomom
      else {
        pages.push(1, '...', this.page - 1, this.page, this.page + 1, '...', this.pagesCount);
      }
    }

    return pages;
  }

  onSortChange(newOrdering: string) {
    this.ordering = newOrdering;
    this.page = 1; 
    this.loadUsers();
  }
}
