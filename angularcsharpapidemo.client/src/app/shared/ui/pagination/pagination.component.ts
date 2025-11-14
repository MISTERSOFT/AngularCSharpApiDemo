import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  hasPrevious = input.required<boolean>();
  hasNext = input.required<boolean>();

  pageChange = output<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    // Show max 5 page numbers
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    // Adjust if we're near the start or end
    if (current <= 3) {
      end = Math.min(5, total);
    }
    if (current >= total - 2) {
      start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Check if there are more pages before the displayed range
   */
  hasMorePagesBefore(): boolean {
    const pages = this.getPageNumbers();
    return pages.length > 0 && pages[0] > 1;
  }

  /**
   * Check if there are more pages after the displayed range
   */
  hasMorePagesAfter(): boolean {
    const pages = this.getPageNumbers();
    return pages.length > 0 && pages[pages.length - 1] < this.totalPages();
  }

  /**
   * Go to first page
   */
  goToFirstPage(): void {
    this.onPageChange(1);
  }

  /**
   * Go to last page
   */
  goToLastPage(): void {
    this.onPageChange(this.totalPages());
  }
}
