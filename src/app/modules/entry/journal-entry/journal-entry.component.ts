import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 100,
      Search: '',
    };
    this.journalEntryService.getJournal(payload);
    this.journalEntryService.createJournal(payload);
  }
  ngOnDestroy(): void {
    this.journalEntryService.unregisterPageHandler();
    this.comonApiService.unregisterPageHandler();
  }
  ngOnInit(): void {
    this.journalEntryService.registerPageHandler((msg) => {
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === 'getJournal') {
        this.isLoading = false;
        this.data = msg.data;
      } else if (msg.for == 'createJournal') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];
          this.showForm = false;
          this.form.reset();
          const index = this.data.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.data[index] = { ...updated };
          } else {
            this.data.push(updated);
          }
        }
      }
      return true;
    });
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
}
