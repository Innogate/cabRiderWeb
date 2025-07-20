import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-quatation-entry',
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    BadgeModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    CardModule,
    TagModule,
    RippleModule
  ],
  templateUrl: './quatation-entry.component.html',
  styleUrl: './quatation-entry.component.css',
})
export class QuatationEntryComponent {
  searchText: any;
  selectedShow: any;
  show = [10, 50, 100, 500, 1000, 2000];

  quatations = [
    {
      quatationNo: 'LC/2/2025-26',
      quatationDate: '02/05/2025',
      party: 'RAMESHWAR CAR RENTALS',
      city: 'KOLKATA',

    },
    // Add more quatation entries here...
  ];

searchquatation() {
throw new Error('Method not implemented.');
}

  addQuatation() {
throw new Error('Method not implemented.');
}
}
