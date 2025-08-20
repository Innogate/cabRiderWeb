import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-fuel-entry',
  standalone: true,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule, InputSwitchModule, CommonModule],
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css']
})
export class AddFuelEntryComponent {

  fuelForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.fuelForm = this.fb.group({
      Branch: ['', Validators.required],
      Date: ['', Validators.required],
      Kilometer: ['', [Validators.required, Validators.min(1)]],
      FuelType: ['', Validators.required],
      Fuel: ['', [Validators.required, Validators.min(1)]],
      Rate: ['', [Validators.required, Validators.min(0.1)]],
      Amount: ['', [Validators.required, Validators.min(1)]],
      Advance: ['', [Validators.min(0)]],
      PurchaseFrom: ['', Validators.required],
      Driver: ['', Validators.required],
      Remarks: [''],
      ReferenceNo: [''],
      City: ['', Validators.required],
      PaidBy: ['', Validators.required],
      FullTank: [false], 
      PayMode: ['', Validators.required],
      AttFile: [null],
    });
  }

  // Dropdown Options
  paidByOptions = [
    { label: 'Company', value: 'company' },
    { label: 'Party', value: 'party' },
    { label: 'Driver', value: 'driver' }
  ];

  payModeOptions = [
    { label: 'Credit', value: 'credit' },
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' },
    { label: 'Wallet', value: 'wallet' }
  ];

  fuelTypeOptions = [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'CNG', value: 'cng' },
    { label: 'EV', value: 'ev' }
  ];

  purchaseFromOptions = [
    { label: 'Harish Pump', value: 'harish pump' },
  ];

  drivers = [
    { label: 'Ram Yadav', value: 'Ram Yadav' },
    { label: 'Suresh', value: 'Suresh' },
    { label: 'Voju Patra', value: 'Voju Patra' },
  ];

  branches = [
    { label: 'New Delhi - Karol Bagh', value: 'New Delhi - Karol Bagh' },
    { label: 'New Market', value: 'New Market' },
    { label: 'Mumbai - Andheri West', value: 'Mumbai - Andheri West' },
  ];

  fullTankOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  // File Upload Handler
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fuelForm.patchValue({ AttFile: file });
    }
  }

  // Save Button
  onSave() {
    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched(); // show validation errors
      return;
    }
    console.log('Fuel Form Values:', this.fuelForm.value);
    this.fuelForm.reset();
  }

  // Save & Add Another
  onSaveAndAddAnother() {
    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched();
      return;
    }
    console.log('Fuel Form Values (Save & Add Another):', this.fuelForm.value);
    this.fuelForm.reset({
      FullTank: false,
      AttFile: null
    });
    this.router.navigate(['/fuel-entry']);
  }
}
