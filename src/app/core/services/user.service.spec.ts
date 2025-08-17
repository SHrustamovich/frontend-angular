import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  username: string;
}
interface UserResponse {
  data: User[];
  page: number;
  pageSize: number;
  total: number;
  pagesCount: number;
}

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://kep.uz/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('search trim bo‘lishi va query paramga qo‘shilishi kerak', () => {
    service.getUsers({ search: '  ali  ' }).subscribe();
    const req = httpMock.expectOne((r) => r.url === baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('ali');
    req.flush(mockResponse());
  });

  it('page, page_size, ordering qo‘shilishi kerak', () => {
    service.getUsers({ page: 2, pageSize: 20, ordering: '-kepcoin' }).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('page_size')).toBe('20');
    expect(req.request.params.get('ordering')).toBe('-kepcoin');
    req.flush(mockResponse());
  });

  it('country array bo‘lsa vergul bilan join qilinishi kerak', () => {
    service.getUsers({ country: ['UZ', 'US'] }).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.get('country')).toBe('UZ,US');
    req.flush(mockResponse());
  });

  it('age_from va age_to son sifatida yuborilishi kerak', () => {
    service.getUsers({ ageFrom: 12, ageTo: 25 }).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.get('age_from')).toBe('12');
    expect(req.request.params.get('age_to')).toBe('25');
    req.flush(mockResponse());
  });

  it('berilmagan paramlar query-ga kirmasligi kerak', () => {
    service.getUsers({}).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockResponse());
  });

  function mockResponse(): UserResponse {
    return { data: [], page: 1, pageSize: 10, total: 0, pagesCount: 0 };
  }
});
