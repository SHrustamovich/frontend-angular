import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(options?: {
    search?: string;
    page?: number;
    pageSize?: number;
    country?: string | string[];
    ageFrom?: number;
    ageTo?: number;
    ordering?: string;
  }): Observable<UserResponse> {
    let params = new HttpParams();

    if (options?.search) {
      params = params.set('search', options.search.trim());
    }

    if (options?.page) {
      params = params.set('page', options.page.toString());
    }

    if (options?.pageSize) {
      params = params.set('page_size', options.pageSize.toString());
    }

    if (options?.country) {
      const countries = Array.isArray(options.country)
        ? options.country.join(',')
        : options.country;
      params = params.set('country', countries);
    }

    if (options?.ageFrom) {
      params = params.set('age_from', options.ageFrom.toString());
    }

    if (options?.ageTo) {
      params = params.set('age_to', options.ageTo.toString());
    }

    if (options?.ordering) {
      params = params.set('ordering', options.ordering);
    }

    return this.http.get<UserResponse>(this.baseUrl, { params });
  }
}

