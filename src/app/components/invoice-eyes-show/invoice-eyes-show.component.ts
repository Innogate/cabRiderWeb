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
  @Input() chargeType: 'taxable' | 'nonTaxable' = 'taxable';
  @Output() close = new EventEmitter<void>();

  display = true;
  charges: any[] = [];
  taxableCharges: any[] = [];
  nonTaxableCharges: any[] = [];

  closeDialog() {
    this.display = false;
    this.close.emit();
  }

 ngOnInit(): void {
  this._helper.registerPageHandler((msg) => {
    let rt = false;

    if (msg.for) {
      //  Handle both "old" and "new" taxable keys
      if (
        (msg.for === 'getTaxableOtherChargesForMonthlyInvoice' ||
         msg.for === 'getOtherTaxableChargesUsingId') &&
        this.chargeType === 'taxable'
      ) {
        this.taxableCharges = (msg.data?.taxable || []).map((c: any, idx: number) => ({
          ...c,
          bookingNo: this.selectedInvoice?.BillNo || '-',
          date: this.selectedInvoice?.BillDate || '-',
          sno: idx + 1
        }));
        console.log('Taxable Charges:', this.taxableCharges);
         //  Push into common array
        this.charges = [...this.taxableCharges];
        console.log('Charges (Taxable):', this.charges);
        rt = true;

      }

      //  Handle both "old" and "new" non-taxable keys
      else if (
        (msg.for === 'getNonTaxableOtherChargesForMonthlyInvoice' ||
         msg.for === 'getOtherNonTaxableChargesUsingId') &&
        this.chargeType === 'nonTaxable'
      ) {
        this.nonTaxableCharges = (msg.data?.nonTaxable || []).map((c: any, idx: number) => ({
          ...c,
          bookingNo: this.selectedInvoice?.BillNo || '-',
          date: this.selectedInvoice?.BillDate || '-',
          sno: idx + 1
        }));
        console.log('Non-Taxable Charges:', this.nonTaxableCharges);
        // Push into common array
        this.charges = [...this.nonTaxableCharges];
        console.log('Charges (Non-Taxable):', this.charges);
        rt = true;
      }
    }

    return rt;
  });

  // Trigger first load
  if (this.chargeType === 'taxable') {
    this.getTaxableCharges();
  } else {
    this.getNonTaxableCharges();
  }
}


 getTaxableCharges() {
  // this._helper.getOtherChargesForMonthlyInvoice({ booking_entry_id })
  if (this.selectedInvoice?.id) {
    console.log('Fetching charges for invoice:', this.selectedInvoice.id);
    this._helper.getTaxableOtherChargesForMonthlyInvoice({ booking_entry_id: this.selectedInvoice.id });
  } else {
    console.error("No selected invoice to fetch charges for.");
  }
}

getNonTaxableCharges() {
  if (this.selectedInvoice?.id) {
    console.log('Fetching non-taxable charges for invoice:', this.selectedInvoice.id);
    this._helper.getNonTaxableOtherChargesForMonthlyInvoice({ booking_entry_id: this.selectedInvoice.id });
  } else {
    console.error("No selected invoice to fetch non-taxable charges for.");
  }
}

}
