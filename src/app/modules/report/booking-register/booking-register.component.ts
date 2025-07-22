import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-booking-register',
  imports: [CommonModule,
            FormsModule,
            CalendarModule,
            DropdownModule,
            ButtonModule
  ],
  templateUrl: './booking-register.component.html',
  styleUrl: './booking-register.component.css'
})
export class BookingRegisterComponent {
tabs = ['Home', 'File', 'View'];
activeTab = 'Home'; // Default active tab

filters = {
    startDate: new Date(),
    endDate: new Date(),
    party: null,
    city: null,
    project: null,
    printInvoice: 'No',
    printProjectName: 'No'
  };

  projects = [
    { name: 'Project Alpha' },
    { name: 'Project Beta' },
    { name: 'Project Gamma' }
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
