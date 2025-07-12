import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './dynamic-table.component.html',
})
export class DynamicTableComponent {
  @ViewChild('dt') dt!: Table;

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() rows: number = 10;
  @Input() rowActions: {
    label?: string;
    icon: string;
    styleClass?: string;
    action: string;
  }[] = [];
  @Input() headerTitle: string = '';
  @Input() loading: boolean = false; // 🔁 Input from parent to control loading state

  @Output() onSearch = new EventEmitter<string>();
  @Output() onAction = new EventEmitter<{ action: string, data: any }>();

  globalFilter: string = '';
  
  handleAction(action: string, row: any) {
    this.onAction.emit({ action, data: row });
  }

  emitSearch() {
    this.dt.filterGlobal(this.globalFilter, 'contains');
    this.onSearch.emit(this.globalFilter);
  }

  applyFilter(event: Event, field: string) {
    const inputElement = event.target as HTMLInputElement;
    this.dt.filter(inputElement.value, field, 'contains');
  }

  get globalFilterFields(): string[] {
    return this.columns.map(col => col.field);
  }

  getIconColor(field: string, value: any): string {
    if (field === 'status') {
      return value === 'Active' ? 'text-green-500' : 'text-red-500';
    }
    return 'text-indigo-500';
  }

  getTextColor(field: string, value: any): string {
    if (field === 'status') {
      return value === 'Active' ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-700';
  }

  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
  }
}
