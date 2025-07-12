import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-voucher-entry',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './voucher-entry.component.html',
  styleUrl: './voucher-entry.component.css',
})
export class VoucherEntryComponent {
selectedShow: any;
show = [20,50,100, 200, 400, 600];
searchText: any;
searchInvoices() {
throw new Error('Method not implemented.');
}
  vouchers = [
    {
      company: 'LC',
      transNo: 'F9C2875E',
      transDate: new Date('2025-06-10'),
      branch: 'NEW MARKET',
      partyType: 'Party',
      partyName: 'INTAS PHARMA LIMITED',
      transactionType: 'Receipt',
      amount: 500,
      amountAdjusted: 500,
      unadjustedAmount: 0,
    },
    {
      company: 'LC',
      transNo: '41226776',
      transDate: new Date('2025-05-02'),
      branch: 'NEW MARKET',
      partyType: 'Vendor',
      partyName: '',
      transactionType: 'Receipt',
      amount: 50000,
      amountAdjusted: 4000,
      unadjustedAmount: 46000,
    },
    {
      company: 'LC',
      transNo: '6768065B',
      transDate: new Date('2025-05-03'),
      branch: 'NEW MARKET',
      partyType: 'Vendor',
      partyName: '',
      transactionType: 'Payment',
      amount: 5000,
      amountAdjusted: 4000,
      unadjustedAmount: 1000,
    },
    {
      company: 'LC',
      transNo: 'C7F7A909',
      transDate: new Date('2025-05-02'),
      branch: 'NEW MARKET',
      partyType: 'Vendor',
      partyName: '',
      transactionType: 'Payment',
      amount: 4000,
      amountAdjusted: 4000,
      unadjustedAmount: 0,
    },
  ];

  addVoucherEntry() {
    console.log('Add Voucher Entry clicked');
  }

  editVoucher(voucher: any) {
    console.log('Edit Voucher:', voucher);
  }

  deleteVoucher(voucher: any) {
    console.log('Delete Voucher:', voucher);
  }

  viewVoucher(voucher: any) {
    console.log('View Voucher:', voucher);
  }
}
