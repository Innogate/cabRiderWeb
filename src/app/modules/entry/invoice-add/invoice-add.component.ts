import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-invoice-add',
  imports: [
    FormsModule,
    RadioButtonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    RippleModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    CalendarModule,
    BadgeModule,
  ],
  templateUrl: './invoice-add.component.html',
  styleUrl: './invoice-add.component.css',
})
export class InvoiceAddComponent {
  taxType = 'cgst';
  rcm = 'no';
  billDate = new Date();

  searchText: any;
  selectedShow: any;
  show = [10, 50, 100, 500, 1000, 2000];
  displayDuty = false;

  invoiceForm!: FormGroup;

  companies = [{ label: 'ABC Ltd', value: 1 }];
  branches = [{ label: 'Main Branch', value: 101 }];
  parties = [{ label: 'XYZ Pvt Ltd', value: 501 }];
  cities = [{ label: 'Delhi', value: 301 }];


 invoices = [
    {
      selected: false,
      siNo: 'DguGFIJKK',
      slipNo: 'SLP001',
      dutyType: 'Local',
      carNo: 'KA-01-AB-1234',
      carType: 'Sedan',
      project: 'ABC Corp Project',
      guestName: 'John Doe',
      fromDate: '2025-07-10',
      toDate: '2025-07-10',
      fromTime: '09:00',
      toTime: '18:00',
      fromKm: 12000,
      toKm: 12200,
      totalTime: '9h',
      totalKm: 200,
      netAmount: 1500,
    },
    // Add more invoice entries here...
  ];


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      id:[null],
      company_id: [null],
      branch_id: [null],
      party_id: [null],
      City: [null],
      BillNo: ['NEW'],
      BillDate: [new Date()],
      taxtype: ['cgst'],
      rcm: ['no'],
      duty_type:[null],
      branch:[null],
      city_id:[null],

    });
  }

  save() {
    const formData = {
      ...this.invoiceForm.value,
      duties: this.invoices,
    };

    console.log('📦 Form Data:', formData);
  }

  searchInvoices() {
    throw new Error('Method not implemented.');
  }



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
