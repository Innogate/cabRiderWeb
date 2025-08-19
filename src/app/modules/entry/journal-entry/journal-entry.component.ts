import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-journal-entry',
  imports: [CommonModule,DynamicTableComponent,ReactiveFormsModule,InputTextModule,DropdownModule],
  templateUrl: './journal-entry.component.html',
  styleUrl: './journal-entry.component.css'
})
export class JournalEntryComponent implements OnInit, OnDestroy, AfterViewInit {



  showForm: boolean = false;
  isLoading: boolean = true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string = '';
  form!: FormGroup;
  tablevalue: any;
  comonApiService: any;

  constructor(
    //private journalEntryService: journalEntryService,
    private router: Router,
    //private messageService: MessageService,
    private fb: FormBuilder

  ) {
    this.createForm();
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createForm() {
    this.form = this.fb.group({
      active: ['Y'],
          id: [0],
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
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        console.log("edit");
        break;
      case 'delete':
        console.log("delete")
        break;
      case 'add':
        this.heading = 'ADD JOURNAL';
        this.showForm = !this.showForm;
        //this.form.reset();
        break;
    }
  }
}