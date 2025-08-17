import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Input() ordering: string | null = null;

  @Output() sortChange = new EventEmitter<string>();

  toggleSort(field: string) {
    let newOrdering: string | null;
    
    if (this.ordering === field) {
      newOrdering = `-${field}`; 
    } else if (this.ordering === `-${field}`) {
      newOrdering = null; 
    } else {
      newOrdering = field;
    }
    
    this.sortChange.emit(newOrdering);
  }

  getSortIcon(field: string): string {
    if (this.ordering === field) return '²'; 
    if (this.ordering === `-${field}`) return '¼'; 
    return '²¼'; 
  }

  formatNumber(num: number | undefined) {
    if (!num && num !== 0) return '';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString('en-US');
  }
}