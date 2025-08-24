import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { branchMasterService } from '../../../services/branchMaster.Service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../../utils/global';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { commonService } from '../../../services/comonApi.service';

@Component({
  selector: 'app-branch-master',
  imports: [CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DynamicTableComponent,
    DropdownModule,
    AutoCompleteModule,
    CheckboxModule],
  templateUrl: './branch-master.component.html',
  styleUrl: './branch-master.component.css'
})

export class BranchMasterComponent implements OnInit,OnDestroy,AfterViewInit {
  
  showForm: boolean= false;
  isLoading: boolean= true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string='';
  form!: FormGroup;
  partyname: any[] = [];
  cities: any[] = [];
  filteredCities: any[] = [];
  cityList: any[] = [{ Id: 0, CityName: '' }];
  tablevalue: any;

  constructor(
    private BranchMasterService: branchMasterService, 
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService,

    
  ){
      this.createForm();
    }

    createForm(){
      this.form = this.fb.group({
      active: ['Y'],
      branch_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      address: [''],
      city: [''],
      state: [''],
      pin_code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      gst: [''],
      pan: [''],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      short_name: [''],
      smtp_host: [''],
      smtp_username: [''],
      smtp_password: [''],
      smtp_email: ['', [ Validators.email]],
      smtp_port: [''],
      smtp_ssl: [true],
      wp_token: [''],
      sms_username: [''],
      sms_password: [''], 
      sms_sender: [''], 
      footer: [''], 
      id: [0],
      })
    }

  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.BranchMasterService.getAllbranch(payload);
    this.commonService.GatAllCityDropDown({});
  }
  ngOnDestroy(): void {
        this.BranchMasterService.unregisterPageHandler();
  }
  ngOnInit(): void {
    this.BranchMasterService.registerPageHandler((msg) => {
       console.log(msg);
        globalRequestHandler(msg, this.router, this.messageService);
        if (msg.for === "getAllBranch") {
          this.isLoading = false
          this.data = msg.data
        }  else if (msg.for == 'getAllCityDropdown') {
        this.cityList = msg.data;
       }else if (msg.for == 'createUpdateBranch') {
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
        if (msg.StatusID === 1) {
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
        // Define the columns for the dynamic table


  columns = [
    { header: 'ID', field: 'id' },
    { header: 'BRANCH NAME', field: 'branch_name', icon: 'pi pi-building-columns', styleClass: 'text-red-900' },
    { header: 'WALLET AMOUNT', field: 'Wallet', icon: 'pi pi-wallet', styleClass: 'text-red-800' },
    { header: 'CITY NAME', field: 'city', icon: 'pi pi-map-marker', styleClass: 'text-red-800' },
    { header: 'STATE NAME', field: 'state', icon: 'pi pi-map', styleClass: 'text-red-800' },
    { header: 'STATE CODE', field: 'state', icon: 'pi pi-envelope', styleClass: 'text-red-800' },    
  ];

  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];
  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm = true;
        this.isEditMode = true;
        this.heading = 'UPDATE BRANCH';
        console.log("edit");
        this.form.patchValue({
          ...event.data,

        })
        break;
      case 'delete':
        console.log("delete")
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD BRANCH';
        this.isEditMode = false;
        console.log("add");
        this.form.reset();
      break;
    }
  }
  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

    saveBranch() {
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' })
      return;
    }
    const payload = {
      ...this.form.value,
    }
    console.log(payload);
    this.BranchMasterService.createUpdateBranch(payload)
  }
}



