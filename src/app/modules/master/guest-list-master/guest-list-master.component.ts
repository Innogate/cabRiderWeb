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
  data: any[]=[];
  heading: string='';
  form!: FormGroup;

  constructor(
    private guestlistMasterService:guestMasterService, 
    private router:Router,
    private messageService:MessageService,
    private fb: FormBuilder,
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
        }
        return true;
      });
    }
  
  
    ngOnDestroy(): void {
    }
  
    ngAfterViewInit(): void {
      const payload = {
        id: 0,
        PageNo: 1,
        PageSize: 1000,
        Search: "",
      };
      this.guestlistMasterService.getAllGuest(payload)
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
        console.log("edit")
        break;
      case 'delete':
        console.log("delete")
        break;
      case 'add':
        this.showForm = true;
        this.isEditMode = false;
        console.log("add")
      break;
    }
  }
  
}
