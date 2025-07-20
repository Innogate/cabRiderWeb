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
  selector: 'app-network-duty',
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
  templateUrl: './network-duty.component.html',
  styleUrl: './network-duty.component.css',
})
export class NetworkDutyComponent {
searchNetworkDuty() {
throw new Error('Method not implemented.');
}
addNetworkDuty() {
throw new Error('Method not implemented.');
}
  searchText: any;
  selectedShow: any;
  show = [10, 50, 100, 500, 1000, 2000];
  searchInvoices() {
    throw new Error('Method not implemented.');
  }
   networks = [
    {
      requestBy: 'John Doe',
      slipNo: 'SLP1234',
      reportingDate: '2025-07-01',
      reportingTime: '10:00 AM',
      carTyperequired: 'Sedan',
      guestName: 'Jane Smith',
      contactNo: '9876543210',
      pickupAddress: '123 Park Street',
      dropAddress: 'Airport Terminal 3',
      partySlipNo: 'PRTY4567',
      status: 'Confirmed'
    }
    // Add more invoice entries here...
  ];

  addVendorInvoice() {
    // Logic to add invoice
  }

  viewInvoice(invoice: any) {
    // Logic to view invoice
  }

  editInvoice(invoice: any) {
    // Logic to edit invoice
  }

  deleteInvoice(invoice: any) {
    // Logic to delete invoice
  }
}
