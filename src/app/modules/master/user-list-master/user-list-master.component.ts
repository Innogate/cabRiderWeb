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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { commonService } from '../../../services/comonApi.service';

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
  tablevalue: any;

    constructor(
    private userListMasterService:userMasterService, 
    private router:Router,
    private messageService:MessageService,
    private fb: FormBuilder,
    private commonService: commonService
    ){
      this.createForm();
    }
  createForm() {
    this.form = this.fb.group({
      id: [0],
      Name: 
          ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      email: 
          ['',[Validators.required,Validators.email,Validators.maxLength(100)]],
      mobile:
          ['',
            [
              Validators.required,
              Validators.pattern(/^[6-9]\d{9}$/), // Indian mobile number format
            ],
          ],
      password:
          ['',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
              Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/), // at least 1 letter, 1 number
            ],
          ],
      username:
          ['',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(30),
              Validators.pattern(/^[a-zA-Z0-9_.-]+$/), // allow alphanum, underscore, dot, dash
            ],
          ],
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
      else if(msg.for === 'createUpdateUser'){
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

      }
      else if (msg.for === "deleteData") {
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
        this.form.patchValue(event.data)
        break;
      case 'delete':
      this.deleteUser(event.data)
      this.tablevalue =event.data
        break;
      case 'add':
        this.heading = 'ADD USER LIST';
        this.showForm = !this.showForm;

        break
    }
  }
  saveUser(){
   if(this.form.invalid){
      this.messageService.add({ severity: 'Error', summary: 'Error', detail: 'Please Input valid Data' });
      return;
   }
   this.userListMasterService.createUpdateUser(this.form.value)

  }
   private deleteUser(user: any) {
    this.messageService.add({ severity: 'contrast', summary: 'Info', detail: 'Please wait processing...' });
    const payload = {
      table_name: "tbl_users",
      column_name: "id",
      column_value: "" + user.id,
    }
    this.commonService.deleteData(payload)
  }

}
