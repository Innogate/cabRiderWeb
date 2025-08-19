import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-fuel-entry',
  standalone: true,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule, InputSwitchModule],
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css']
})
export class AddFuelEntryComponent {

  fuelForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.fuelForm = this.fb.group({
      Branch: [''],
      Date: [''],
      Kilometer: [''],
      FuelType: [''],
      Fuel: [''],
      Rate: [''],
      Amount: [''],
      Advance: [''],
      PurchaseFrom: [''],
      Driver: [''],
      Remarks: [''],
      ReferenceNo: [''],
      City: [''],
      PaidBy: [''],
      FullTank: [false],
      PayMode: [''],
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

  // File Upload Handler
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fuelForm.patchValue({ AttFile: file });
    }
  }

  // Save Button
  onSave() {
    console.log('Fuel Form Values:', this.fuelForm.value);
    this.fuelForm.reset();
  }

  // Save & Add Another
  onSaveAndAddAnother() {
    console.log('Fuel Form Values (Save & Add Another):', this.fuelForm.value);
    this.fuelForm.reset({
      FullTank: false,
      AttFile: null
    });
    this.router.navigate(['/fuel-entry']);
  }
}
