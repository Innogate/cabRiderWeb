import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-openingbill-entry',
  imports: [
    FormsModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    RippleModule,
    CardModule,
    CommonModule,
    BadgeModule
  ],
  templateUrl: './openingbill-entry.component.html',
  styleUrl: './openingbill-entry.component.css',
})
export class OpeningbillEntryComponent {

searchText: any;
selectedShow: any;
show = [10, 50, 100, 500, 1000, 2000]

  openingBills = [
    {
      company: 'New',
      branch: 'NEW MARKET',
      billType:'Sale',
      opBillNo: 'LC/2/2025-26',
      opBillDate: '02/05/2025',
      party: 'RAMESHWAR CAR RENTALS',
      billAmount: 6744.5,
      dueAmount: 171.11,
      recevAmount: 171.11,
      balance: 0,

    },
    // Add more openingbill entries here...
  ];

searchOpeningBill() {
throw new Error('Method not implemented.');
}
addOpeningBill() {
throw new Error('Method not implemented.');
}

}
