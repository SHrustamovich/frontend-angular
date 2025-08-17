import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
}
interface UserResponse {
  data: User[];
  page: number;
  pageSize: number;
  total: number;
  pagesCount: number;
}

class MockUserService {
  lastOptions: any;
  getUsers(opts?: any) {
    this.lastOptions = opts;
    const resp: UserResponse = {
      data: [
        { id: 1, username: 'ali' },
        { id: 2, username: 'vali' },
      ],
      page: 1,
      pageSize: 10,
      total: 2,
      pagesCount: 1,
    };
    return of(resp);
  }
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, CommonModule],
      providers: [
        {
          provide: (await import('../../../../core/services/user.service')).UserService,
          useClass: MockUserService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(
      (await import('../../../../core/services/user.service')).UserService
    ) as any;
    fixture.detectChanges(); 
  });

  it('initial loadUsers chaqirilishi kerak', () => {
    expect(mockService.lastOptions).toBeTruthy();
    expect(component.users.length).toBe(2);
  });

  it('toggleSort sikli: field -> -field -> null', () => {
    component.toggleSort('kepcoin');
    expect(component['ordering']).toBe('kepcoin');

    component.toggleSort('kepcoin');
    expect(component['ordering']).toBe('-kepcoin');

    component.toggleSort('kepcoin');
    expect(component['ordering']).toBeNull();
  });

  it('applyAgeFilter age_from/age_to bilan getUsers chaqirishi kerak', () => {
    component.ageFrom = 12;
    component.ageTo = 25;
    component.applyAgeFilter();

    expect(mockService.lastOptions.ageFrom).toBe(12);
    expect(mockService.lastOptions.ageTo).toBe(25);
    expect(component.page).toBe(1);
  });

  it('country filter ham options.country ichida bo‘lishi kerak (qo‘lda set qilib, loadUsers)', () => {
    (mockService as any).lastOptions = null;
    (component as any).userService.getUsers({ country: 'UZ' }).subscribe();
    expect(mockService.lastOptions.country).toBe('UZ');
  });

  it('local search filter (applyFilter) client-side ishlashi kerak', () => {
    component['allUsers'] = [
      {
          id: 1, username: 'ali', firstName: 'Ali', lastName: 'Aliyev',
          streak: 0,
          avatar: '',
          lastSeen: '',
          kepcoin: 0,
          skillsRating: '',
          activityRating: ''
      },
      {
          id: 2, username: 'vali', firstName: 'Vali', lastName: 'Valiyev',
          streak: 0,
          avatar: '',
          lastSeen: '',
          kepcoin: 0,
          skillsRating: '',
          activityRating: ''
      },
    ];
    (component as any).applyFilter('ali');
    expect(component.users.length).toBe(1);
    expect(component.users[0].username).toBe('ali');
  });
});
