import { Injectable } from '@angular/core';
import { AbstractBaseApiService } from '@app/core/http';
import { Observable } from 'rxjs';
import { DashboardStatsDto } from '../types';

/**
 * Service for admin dashboard operations
 */
@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService extends AbstractBaseApiService {
  readonly controllerUrl = `${this.baseUrl}/admindashboard`

  /**
   * Get dashboard statistics (products count, categories count)
   */
  getDashboardStats(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>(`${this.controllerUrl}/stats`);
  }
}
