import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminDashboardService } from '@app/services';
import { DashboardStatsDto } from '@app/types';
import { catchError, finalize, of } from 'rxjs';

/**
 * Admin dashboard component
 * Displays statistics and overview of the system
 */
@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  private readonly _adminDashboardService = inject(AdminDashboardService);

  /**
   * Dashboard statistics
   */
  stats = signal<DashboardStatsDto | null>(null);

  /**
   * Loading state
   */
  isLoading = signal(false);

  /**
   * Error message
   */
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  /**
   * Load dashboard statistics from the server
   */
  loadDashboardStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this._adminDashboardService.getDashboardStats().pipe(
      catchError((error) => {
        this.errorMessage.set('Failed to load dashboard statistics. Please try again.');
        console.error('Load dashboard stats error:', error);
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (stats) => {
        if (stats) {
          this.stats.set(stats);
        }
      }
    });
  }
}
