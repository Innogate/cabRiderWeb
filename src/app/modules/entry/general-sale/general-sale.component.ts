import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { commonService } from '../../../services/comonApi.service';

@Component({
  selector: 'app-general-sale',
  imports: [DynamicTableComponent,CommonModule,DropdownModule,AutoCompleteModule,InputTextModule,ReactiveFormsModule,FormsModule],
  templateUrl: './general-sale.component.html',
  styleUrl: './general-sale.component.css'
})
export class GeneralSaleComponent implements OnInit, OnDestroy, AfterViewInit {
isLoading = true;
users: any[]= [];
showForm = false;
heading = '';
form!: FormGroup;
rows: any[] = [];






  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private commonService: commonService,
    
    
  ) {
    this.createForm();
    
  }
  createForm(){
    this.form = this.fb.group({

    })
  }


  async ngOnInit(): Promise<void> {

  }

  ngOnDestroy(): void {
  }

  async ngAfterViewInit(): Promise<void> {

}

  columns = [
    { header: 'ID', field: 'id' },
    // { header: 'Car Type', field: 'car_type', icon: 'pi pi-car', styleClass: 'text-red-600' },
    // { header: 'Sitting Capacity', field: 'sitting_capacity', icon: 'pi pi-check-circle', styleClass: 'text-green-600' },
    // { header: 'Index Order', field: 'index_order', icon: 'pi pi-mars', styleClass: 'text-blue-600' },
  ];


  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  // Handle search events
  handleSearch(searchTerm: string) {

  }

  // Handle action events
  async handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'view':
        break;
      case 'edit':
        this.showForm = true;
        this.heading = 'UPDATE GENERAL'
        break;
      case 'delete':
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD GENERAL'
        break

    }
  }
  addRow() {
    this.rows.push({
      slno: '',
      description: '',
      unit: '',
      quantity: '',
      rate: '',
      amount: '',
      isEditing: true
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }
enableEdit(row: any) {
    // Disable editing on all other rows
    this.rows.forEach(r => r.isEditing = false);
    row.isEditing = true;
  }

  saveRow(row: any) {
    // Calculate amount (optional logic, remove if not needed)
    if (!isNaN(row.quantity) && !isNaN(row.rate)) {
      row.amount = row.quantity * row.rate;
    }

    row.isEditing = false;
  }

}
