import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <div class="pagination-info">
        <span class="pagination-text">
          Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} results
        </span>
      </div>
      
      <div class="pagination-controls">
        <!-- First Page -->
        <button 
          class="pagination-btn first-page"
          [disabled]="currentPage === 1"
          (click)="goToPage(1)"
          title="First page">
          <fa-icon [icon]="faAngleDoubleLeft"></fa-icon>
        </button>
        
        <!-- Previous Page -->
        <button 
          class="pagination-btn prev-page"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)"
          title="Previous page">
          <fa-icon [icon]="faChevronLeft"></fa-icon>
        </button>
        
        <!-- Page Numbers -->
        <div class="page-numbers">
          <button 
            *ngFor="let page of visiblePages" 
            class="pagination-btn page-number"
            [class.active]="page === currentPage"
            [class.ellipsis]="page === '...'"
            [disabled]="page === '...'"
            (click)="onPageClick(page)"
            [title]="page === '...' ? '' : 'Go to page ' + page">
            <span *ngIf="page !== '...'">{{ page }}</span>
            <fa-icon *ngIf="page === '...'" [icon]="faEllipsisH"></fa-icon>
          </button>
        </div>
        
        <!-- Next Page -->
        <button 
          class="pagination-btn next-page"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)"
          title="Next page">
          <fa-icon [icon]="faChevronRight"></fa-icon>
        </button>
        
        <!-- Last Page -->
        <button 
          class="pagination-btn last-page"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(totalPages)"
          title="Last page">
          <fa-icon [icon]="faAngleDoubleRight"></fa-icon>
        </button>
      </div>
      
      <!-- Page Size Selector -->
      <div class="page-size-selector">
        <label for="pageSize" class="page-size-label">Show:</label>
        <select 
          id="pageSize"
          class="page-size-select"
          [value]="pageSize"
          (change)="onPageSizeChange($event)">
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
        <span class="page-size-text">per page</span>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4) var(--spacing-6);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.1);
      border-radius: var(--radius-lg);
      margin-top: var(--spacing-6);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      flex-wrap: wrap;
      gap: var(--spacing-4);
      position: relative;
      overflow: hidden;
    }

    .pagination-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #ec4899, #06b6d4);
      opacity: 0.8;
    }

    body.dark-mode .pagination-container {
      background: linear-gradient(135deg, rgba(26, 26, 36, 0.95) 0%, rgba(17, 17, 24, 0.9) 100%);
      backdrop-filter: blur(10px);
      border-color: rgba(99, 102, 241, 0.2);
    }

    body.dark-mode .pagination-container::before {
      background: linear-gradient(90deg, #6366f1, #ec4899, #06b6d4);
      opacity: 0.6;
    }

    .pagination-info {
      display: flex;
      align-items: center;
    }

    .pagination-text {
      font-size: var(--text-sm);
      color: var(--light-text-secondary);
      font-weight: var(--font-medium);
    }

    body.dark-mode .pagination-text {
      color: var(--dark-text-secondary);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .page-numbers {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      margin: 0 var(--spacing-2);
    }

    .pagination-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      border: 1px solid var(--light-border);
      background: var(--light-surface);
      color: var(--light-text-secondary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: var(--transition-all);
      position: relative;
      overflow: hidden;
    }

    body.dark-mode .pagination-btn {
      border-color: var(--dark-border);
      background: var(--dark-surface);
      color: var(--dark-text-secondary);
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--light-card-hover);
      color: var(--light-text-muted);
    }

    body.dark-mode .pagination-btn:disabled {
      background: var(--dark-card-hover);
      color: var(--dark-text-muted);
    }

    .pagination-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .pagination-btn.ellipsis {
      cursor: default;
      background: transparent;
      border: none;
    }

    .pagination-btn.ellipsis:hover {
      background: transparent;
      transform: none;
      box-shadow: none;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .page-size-label {
      font-size: var(--text-sm);
      color: var(--light-text-secondary);
      font-weight: var(--font-medium);
    }

    body.dark-mode .page-size-label {
      color: var(--dark-text-secondary);
    }

    .page-size-select {
      padding: var(--spacing-2) var(--spacing-3);
      border: 1px solid var(--light-border);
      border-radius: var(--radius-md);
      background: var(--light-surface);
      color: var(--light-text);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: var(--transition-all);
    }

    body.dark-mode .page-size-select {
      border-color: var(--dark-border);
      background: var(--dark-surface);
      color: var(--dark-text);
    }

    .page-size-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .page-size-text {
      font-size: var(--text-sm);
      color: var(--light-text-secondary);
      font-weight: var(--font-medium);
    }

    body.dark-mode .page-size-text {
      color: var(--dark-text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-4);
      }

      .pagination-controls {
        justify-content: center;
        flex-wrap: wrap;
      }

      .page-numbers {
        margin: 0;
      }

      .pagination-btn {
        min-width: 36px;
        height: 36px;
        font-size: var(--text-xs);
      }

      .page-size-selector {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .pagination-container {
        padding: var(--spacing-3);
      }

      .pagination-btn {
        min-width: 32px;
        height: 32px;
      }

      .page-numbers {
        gap: var(--spacing-0_5);
      }
    }
  `]
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 6;
  @Input() maxVisiblePages: number = 5;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // FontAwesome Icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faEllipsisH = faEllipsisH;

  totalPages: number = 0;
  visiblePages: (number | string)[] = [];

  ngOnInit() {
    this.calculatePagination();
  }

  ngOnChanges() {
    this.calculatePagination();
  }

  private calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.generateVisiblePages();
  }

  private generateVisiblePages() {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(this.maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, this.currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < this.maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }

    this.visiblePages = pages;
  }

  onPageClick(page: number | string) {
    if (page !== '...' && typeof page === 'number') {
      this.goToPage(page);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
      this.generateVisiblePages();
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);
    
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // Reset to first page
      this.pageSizeChange.emit(newPageSize);
      this.calculatePagination();
    }
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}