import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guestMasterService } from '../../../services/guestMaster.service';
import { MessageService } from 'primeng/api';
import { userMasterService } from '../../../services/userMaster.service';
import { globalRequestHandler } from '../../../utils/global';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list-master',
  imports: [CommonModule, DynamicTableComponent, DropdownModule, AutoCompleteModule, ReactiveFormsModule], 
  templateUrl: './user-list-master.component.html',
  styleUrl: './user-list-master.component.css'
})
export class UserListMasterComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean= true;
  data: any[]=[];
  form!: FormGroup;
  heading: String = '';
  showForm: boolean = false;


    constructor(
    private userListMasterService:userMasterService, 
    private router:Router,
    private messageService:MessageService,
    private fb: FormBuilder,
    ){
      this.createForm();
    }
  createForm() {
    this.form = this.fb.group({
      id: [0],
      party_name: [''],
      address: [''],
      city_id: [],
      pin_code: [''],
      mobileno: [''],
      whatsappno: [''],
      gstno: [''],
      panno: [''],
      refby: [''],
      active: ['Y'],
      crdays: [0],
      crlimit: [0],
      email: [''],
      CGST: [0],
      SGST: [0],
      IGST: [0],
      phone_no: [''],
      credit_days: [0],
      credit_limit: [0],
      tax_type: ['CGST/SGST'],
      rcm: ['N'],
      cinno: [''],
      msmeno: [''],
      billing_instruction: [''],
      alias: [''],
    });
  }
ngOnInit(): void {
    this.userListMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === 'getAllUserList'){
        this.isLoading = false;
        this.data = msg.data;
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
    this.userListMasterService.getAllUser(payload);
  }
    // Define the columns for the dynamic table
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'Name', icon: 'pi pi-user', styleClass: 'text-red-500' },
    { header: 'Phone No', field: 'mobile', icon: 'pi pi-phone', styleClass: 'text-green-600' },
    { header: 'Email', field: 'email', icon: 'pi pi-at', styleClass: 'text-red-800' },
    { header: 'User Name', field: 'username', icon: 'pi pi-id-card', styleClass: 'text-sky-500' },
    { header: 'Password', field: 'password', icon: 'pi pi-key', styleClass: 'text-green-600' },
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
        this.heading = 'UPDATE USER LIST';
        this.showForm = true;
        console.log("Edit");
        break;
      case 'delete':
        break;
      case 'add':
        this.heading = 'ADD USER LIST';
        this.showForm = !this.showForm;
        console.log("Add");
        break
    }
  }
}
