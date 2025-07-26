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
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-vendor-invoice-entry',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    BadgeModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    CardModule,
    CommonModule,
    TagModule,
    RippleModule
  ],
  templateUrl: './vendor-invoice-entry.component.html',
  styleUrl: './vendor-invoice-entry.component.css',
})
export class VendorInvoiceEntryComponent {
  constructor(private router: Router) {};
   showVendorInvoiceModal = false; // 👈 modal flag

searchText: any;
selectedShow: any;
show = [10, 50, 100, 500, 1000, 2000]
searchInvoices() {
throw new Error('Method not implemented.');
}
  invoices = [
    {
      branch: 'NEW MARKET',
      invoiceNo: 'LC/2/2025-26',
      invoiceDate: '02/05/2025',
      party: 'RAMESHWAR CAR RENTALS',
      city: 'KOLKATA',
      grossAmount: 6744.5,
      otherChargesTaxable: '100.00',
      cgst: 171.11,
      sgst: 171.11,
      igst: 0,
      otherChargesNonTaxable: '0.00',
      netAmount: 7187,
      lessFuelAdvance: 0,
      dueBalance: 8687,
    },
    // Add more invoice entries here...
  ];

 // ✅ Navigate to new invoice entry page
  addNewVendorInvoice() {
    this.router.navigate(['/add-new-vendor-invoice']);
    this.showVendorInvoiceModal = true; // 👈 show modal on button click
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
