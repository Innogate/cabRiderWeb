import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guestMasterService } from '../../../services/guestMaster.service';
import { globalRequestHandler } from '../../../utils/global';
import { MessageService } from 'primeng/api';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { commonService } from '../../../services/comonApi.service';




@Component({
  selector: 'app-guest-list-master',
  imports: [CommonModule,DynamicTableComponent, AutoCompleteModule, DropdownModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './guest-list-master.component.html',
  styleUrl: './guest-list-master.component.css'
})
export class GuestListMasterComponent implements OnInit,OnDestroy,AfterViewInit {
  showForm: boolean= false;
  isLoading: boolean= true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string='';
  form!: FormGroup;
  partyname: any[] = [];
  tablevalue: any;
  
  constructor(
    private guestlistMasterService: guestMasterService, 
    private router: Router,
    private messageService: MessageService,
    private comonApiService: commonService,
    private fb: FormBuilder
    
  ){
      this.createForm();
    }

    createForm(){
      this.form = this.fb.group({
        active: ['Y'],
        AddrType: [''],
        Address: [''],
        AditionalContactNo: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
        ContactNo: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
        EmailID: ['', [Validators.email]],
        GuestName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
        Honorific: [''],
        PartyID: [''],
        id: [0],
        party_name: [''],

      })
    }


    ngOnInit(): void {
      this.guestlistMasterService.registerPageHandler((msg) => {
        console.log(msg);
        globalRequestHandler(msg, this.router, this.messageService);
        if(msg.for === "getallguest"){
          this.isLoading=false
          this.data=msg.data
        } else if (msg. for === "getAllPartyDropdown"){
          this.partyname = msg.data;
        } else if (msg.for == 'createUpdateVendorMaster') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0];  // access the first item in data array

          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
          this.showForm = false;
          this.form.reset();

          const index = this.data.findIndex((v: any) => v.id == updated.id);
          if (index !== -1) {
            this.data[index] = { ...updated };
          } else {
            this.data.push(updated)
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
        }

      } else if (msg.for === "deleteData") {
        if (msg.StatusMessage === "success") {
          const index = this.data.findIndex((v: any) => v.id == this.tablevalue.id);
          if (index !== -1) {
            this.data.splice(index, 1);
          } 
          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Cannot Delete data" })
        }
      } 
        return true;
      });
      
    }
  
  
    ngOnDestroy(): void {
      this.guestlistMasterService.unregisterPageHandler();
      this.comonApiService.unregisterPageHandler();
    }
  
    ngAfterViewInit(): void {
      const payload = {
        id: 0,
        PageNo: 1,
        PageSize: 1000,
        Search: "",
      };
      this.guestlistMasterService.getAllGuest(payload)
      this.comonApiService.gateAllPartyNameDropdown();
    }


      // Define the columns for the dynamic table

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Party Name', field: 'party_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'Guest Name', field: 'GuestName', icon: 'pi pi-user', styleClass: 'text-green-600' },
    { header: 'Address Type', field: 'AddrType', icon: 'pi pi-map', styleClass: 'text-lime-600' },
    { header: 'Contact No', field: 'ContactNo', icon: 'pi pi-phone' },
    { header: 'Address', field: 'Address', icon: 'pi pi-map', styleClass: 'text-green-600' },
    { header: 'Email', field: 'EmailID', icon: 'pi pi-at', styleClass: 'text-yellow-600' },
    { header: 'Aditional No', field: 'AditionalContactNo', icon: 'pi pi-address-book', styleClass: 'text-indigo-700' },
    // { header: 'Pin Code', field: 'pin_code', icon: 'pi pi-slack' },
    // { header: 'Driver Licenseno', field: 'drv_licenseno', icon: 'pi pi-slack' },
    // { header: 'Bank Name', field: 'bank_name', icon: 'pi pi-slack' },
    // { header: 'Bank Branch', field: 'bank_branch', icon: 'pi pi-slack' },
    // { header: 'Bank Account No', field: 'bank_acno', icon: 'pi pi-slack' },
    // { header: 'Bank Account Type', field: 'bank_actype', icon: 'pi pi-slack' },
  ];

  actions = [
    // { icon: 'pi pi-eye', action: 'view', styleClass: 'p-button-info' },
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];


  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm = true;
        this.isEditMode = true;
        console.log("edit");
        const  partyname = this.partyname.find(partyname =>partyname.Id == event.data.party_name);
        this.form.patchValue({
          ...event.data,
          party_name: partyname
        })
        break;
      case 'delete':
        this.deleteguest(event.data)
        this.tablevalue=event.data
        console.log("delete")
        break;
      case 'add':
        this.showForm = true;
        this.isEditMode = false;
        console.log("add");
        this.form.reset();
      break;
    }
  }
  honorificOptions = [
    { label: 'Mr', value: 'Mr' },
    { label: 'Md', value: 'Md' },
    { label: 'Mrs', value: 'mrs' },
    { label: 'Miss', value: 'miss' },
    { label: 'Ms', value: 'ms' },
    { label: 'Prof', value: 'prof' },
    { label: 'Col', value: 'col' },
    { label: 'Maj', value: 'maj' },
    { label: 'Dr.', value: 'dr' },
    { label: 'Smt', value: 'smt' },
  ];

  addressTypeOption = [
    { label: 'Home', value: 'home'},
    { label: 'Office', value: 'office'},
    { label: 'Others', value: 'others'},
  ]

  saveGuest() {
    console.log("form value", this.form.value)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: "save sucessfull" });
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' });
      return;
    }
    const payload = {
      ...this.form.value,
      Address: "" + this.form.value.Address,
      // AditionalContactNo: "" + this.form.value.AditionalContactNo,
      // EmailID: "" + this.form.value.EmailID,
      // party_name: "" + this.form.value.party_name,
      
    }
    this.guestlistMasterService.createGuest(payload)
  }

  private deleteguest(guest: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "getallguest",
      column_name: "id",
      column_value: "" + guest.id,
    }
    this.comonApiService.deleteData(payload)
  }
}