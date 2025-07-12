import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-invoice-register',
  imports: [FormsModule,
            CommonModule,
            DropdownModule,
            TabsModule,
            CalendarModule,
            ButtonModule,
            CheckboxModule
  ],
  templateUrl: './invoice-register.component.html',
  styleUrl: './invoice-register.component.css'
})
export class InvoiceRegisterComponent {
tabs = ['Home', 'File', 'View'];
activeTab = 'Home'; // Default active tab

filters = {
    startDate: new Date(),
    endDate: new Date(),
    party: null,
    city: null,
    cityNull: false,
    company: null,
    printInvoice: 'No',
    printProjectName: 'No'
  };

  companies = [
    { name: 'ATT' },
    { name: 'GD' },
    { name: 'TF' }
  ];

  parties = [
    { name: 'Party A' },
    { name: 'Party B' },
    { name: 'Party C' }
  ];

  cities = ['Kolkata', 'Mumbai', 'Delhi', 'Chennai'];

  yesNoOptions = ['Yes', 'No'];

  viewReport() {
    console.log('Filters:', this.filters);
    // Add your report service logic here
  }
}
