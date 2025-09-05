import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { globalRequestHandler } from '../../../utils/global';
import { MessageService } from 'primeng/api';
import { JournalEntryService } from '../../../services/journalEntry.service';

@Component({
  selector: 'app-journal-entry',
  imports: [
    CommonModule,
    DynamicTableComponent,
    ReactiveFormsModule,
    InputTextModule,
    AutoCompleteModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './journal-entry.component.html',
  styleUrl: './journal-entry.component.css',
})
export class JournalEntryComponent implements OnInit, OnDestroy, AfterViewInit {
  showForm: boolean = false;
  isLoading: boolean = true;
  data: any[] = [];
  heading: string = '';
  form!: FormGroup;
  tablevalue: any;
  comonApiService: any;
  journalentrylist: any[] = [];
  rows: any[] = [];

  constructor(
    private journalEntryService: JournalEntryService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      active: ['Y'],
      id: [0],
      seletedCompany: [''],
      branchId: [''],
      vouchNo: [''],
      vouchDate: [''],
      narr: [''],
      totalDebitAmt: [''],
      totalCreditAmt: [''],
      amtAdjusted: [''],
      cancelYN: [''],
      cancelBy: [''],
      cancelOn: [''],
      cancelReason: [''],
      user_id: [''],
      transactions: [
        {
          ledgerType: [''],
          partyId: [''],
          debitAmt: [''],
          creditAmt: [''],
        },
        {
          ledgerType: [''],
          partyId: [''],
          debitAmt: [''],
          creditAmt: [''],
        },
      ],
    });
  }

  
  ngOnInit(): void {
    this.journalEntryService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      
      if(){
        
      }
      return true;
    });
  }
  ngOnDestroy(): void {
    this.journalEntryService.unregisterPageHandler();
  }
    ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 100,
      Search: '',
    };
this.journalEntryService.getJournal(payload);

  }
  // Define the columns for the dynamic table

  columns = [
    { header: 'ID', field: 'id' },
    //{ header: 'Company Name', field: 'Name', icon: 'pi pi-building', styleClass: 'text-red-600' },
    // { header: 'Company Address', field: 'Address', icon: 'pi pi-map-marker', styleClass: 'text-green-600' },
    // { header: 'Contact No', field: 'Phone', icon: 'pi pi-phone' },
    // { header: 'Short Name', field: 'ShortName', icon: 'pi pi-tag', styleClass: 'text-lime-600' },
    // { header: 'Email', field: 'Email', icon: 'pi pi-envelope', styleClass: 'text-yellow-600' },
    // { header: 'Website', field: 'Website', icon: 'pi pi-globe', styleClass: 'text-green-600' },
    // { header: 'City', field: 'City', icon: 'pi pi-map', styleClass: 'text-indigo-700' },
  ];

  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' },
  ];

  handleAction(event: { action: string; data: any }) {
    switch (event.action) {
      case 'edit':
        console.log('edit');
        break;
      case 'delete':
        console.log('delete');
        break;
      case 'add':
        console.log('add');
        this.heading = 'ADD JOURNAL';
        this.showForm = !this.showForm;
        this.form.reset();
        break;
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
