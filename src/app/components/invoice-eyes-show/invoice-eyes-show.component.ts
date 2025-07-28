import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-invoice-eyes-show',
  imports:[TableModule,
          DialogModule,
          ButtonModule,
          ],
  templateUrl: './invoice-eyes-show.component.html',
  styleUrl: './invoice-eyes-show.component.css'
})
export class InvoiceEyesShowComponent {
  @Input() invoice: any;
  @Output() close = new EventEmitter<void>();

    closeDialog() {
    this.display = false;
    this.close.emit(); // notify parent
  }
 display = true;

  charges = [
    {
      bookingNo: 'LC05022025-54',
      date: '24/07/2025',
      otherCharges: 'LC-DRIVER ALLOW',
      amount: 100
    }
  ];
}
