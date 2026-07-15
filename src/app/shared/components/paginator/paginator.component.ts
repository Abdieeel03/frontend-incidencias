import { Component, computed, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = input<number>(10);
  
  readonly pageChange = output<number>();
  
  readonly currentPage = signal(0);
  
  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.totalItems() / this.pageSize()));
  });
  
  readonly startIndex = computed(() => {
    if (this.totalItems() === 0) return 0;
    return this.currentPage() * this.pageSize() + 1;
  });
  
  readonly endIndex = computed(() => {
    return Math.min((this.currentPage() + 1) * this.pageSize(), this.totalItems());
  });

  readonly hasPrevious = computed(() => this.currentPage() > 0);
  readonly hasNext = computed(() => this.currentPage() < this.totalPages() - 1);

  constructor() {
    effect(() => {
      this.totalItems();
      if (this.currentPage() >= this.totalPages()) {
        const newPage = Math.max(0, this.totalPages() - 1);
        this.currentPage.set(newPage);
        this.pageChange.emit(newPage);
      }
    }, { allowSignalWrites: true });
  }

  goToPrevious(): void {
    if (this.hasPrevious()) {
      const newPage = this.currentPage() - 1;
      this.currentPage.set(newPage);
      this.pageChange.emit(newPage);
    }
  }

  goToNext(): void {
    if (this.hasNext()) {
      const newPage = this.currentPage() + 1;
      this.currentPage.set(newPage);
      this.pageChange.emit(newPage);
    }
  }

  reset(): void {
    if (this.currentPage() !== 0) {
      this.currentPage.set(0);
      this.pageChange.emit(0);
    }
  }
}
