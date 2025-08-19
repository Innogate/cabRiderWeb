import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgModel } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fuel-entry',
  imports: [CommonModule, ButtonModule, TableModule, DropdownModule, FormsModule],
  templateUrl: './fuel-entry.component.html',
  styleUrl: './fuel-entry.component.css'
})
export class FuelEntryComponent {
  

  constructor(private router: Router) { }
  searchInvoices() {
    throw new Error('Method not implemented.');
  }
  vendors = [
    { label: 'ALAM', value: 'ALAM' },
    { label: 'BARUN SARDAR', value: 'BARUN SARDAR' },
    { label: 'CAB RYDER(Network)', value: 'CAB RYDER(Network)' },
    { label: 'GURDEEP SINGH', value: 'GURDEEP SINGH' },
    { label: 'HARISH PUMP', value: 'HARISH PUMP' },
    { label: 'LIMUSINE TRAVELS', value: 'LIMUSINE TRAVELS' },
    { label: 'RAMESHWAR CAR RENTALS', value: 'RAMESHWAR CAR RENTALS' },

  ];

  cars = [
    { label: 'WB02AP1713', value: 'X' },
    { label: 'WB02AP1713', value: 'Y' },

  ];

  selectedVendor: any;
  selectedCar: any;
  searchText: string = '';


  goToAdd() {
    this.router.navigate(['/add-fuel-entry']);
  }
};


