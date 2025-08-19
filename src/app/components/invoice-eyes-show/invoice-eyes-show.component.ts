import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { HelperService } from '../../services/helper.service';
import { globalRequestHandler } from '../../utils/global';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MonthlyInvoiceListComponent } from '../../modules/entry/monthlyInvoice/monthly-invoice-list/monthly-invoice-list.component';

@Component({
  selector: 'app-invoice-eyes-show',
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './invoice-eyes-show.component.html',
  styleUrl: './invoice-eyes-show.component.css'
})
export class InvoiceEyesShowComponent implements OnInit {
  constructor(
    private _helper: HelperService,
    private cdr: ChangeDetectorRef,
    private Router: Router,
    private messageService: MessageService
  ) {}


  @Input() invoice: any;
  @Input() id: any[] = [];
  @Input() selectedInvoice: any;
  @Input() sleetedBookingIds?: any[];
  @Output() close = new EventEmitter<void>();

  display = true;
  charges: any[] = [];

  closeDialog() {
    this.display = false;
    this.close.emit();
  }

  ngOnInit(): void {

    this._helper.registerPageHandler((msg) => {
    let rt = false;

    if (msg.for === 'getOtherChargesForMonthlyInvoice') {
      const taxable = msg.data?.taxable || [];
      const nonTaxable = msg.data?.nonTaxable || [];

      // Merge and enrich data for table
      this.charges = [...taxable, ...nonTaxable].map((c, idx) => ({
        ...c,
        bookingNo: this.selectedInvoice?.BillNo || '-',
        date: this.selectedInvoice?.BillDate || '-',
        sno: idx + 1
      }));

      console.log('Charges (final):', this.charges);

      rt = true; // <-- Important, tells service “I handled this msg”
    }

    return rt;
  });

    this.getcharges();
  }

 getcharges() {
  // this._helper.getOtherChargesForMonthlyInvoice({ booking_entry_id })
  if (this.selectedInvoice?.id) {
    console.log('Fetching charges for invoice:', this.selectedInvoice.id);
    this._helper.getOtherChargesForMonthlyInvoice({ booking_entry_id: this.selectedInvoice.id });
  } else {
    console.error("No selected invoice to fetch charges for.");
  }
}


}
