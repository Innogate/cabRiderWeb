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
import { generalSalebillService } from '../../../services/generalSalebill.service';
import { globalRequestHandler } from '../../../utils/global';

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
tablevalue: any;
filteredCompany: any[] = [];
companyList: any[] = [];
filteredParty: any[] = [];
partyList: any[] = [];
filteredBranch: any[] = [];
branchList: any[] = [];
filteredCity: any[] = [];
cityList: any[] = [];








  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private commonService: commonService,
    private generalSalebillService: generalSalebillService,
    
  ) {
    this.createForm();
    
  }
  createForm(){
    this.form = this.fb.group({
      company_id: [''],
      BranchID: [''],
      CityID: [''],
      InvNo: "INV-2025-001",
      InvDate: "2025-09-10",
      DueDate: "2025-09-25",
      PartyID: [''],
      InvType: "CASH",
      TaxType: "GST",
      RCM: false,
      GrossAmt: 5000,
      DiscPer: 5,
      DiscAmt: 250,
      CGSTPer: 9,
      CGSTAmt: 428,
      SGSTPer: 9,
      SGSTAmt: 428,
      IGSTPer: 0,
      IGSTAmt: 0,
      RndOffAmt: -1,
      NetAmt: 5605,
      AmtAdjusted: 0,
      TaxChargesName1: "other", 
      TaxChargeAmt1: 500,
      TaxChargesName2: "other",
      TaxChargeAmt2: 5000,
      NonTaxChargeName1: "other", 
      NonTaxChargeAmt1: 2500, 
      NonTaxChargeName2 : "other", 
      NonTaxChargeAmt2: 4800,
    })
  }


  async ngOnInit(): Promise<void> {
    this.generalSalebillService.registerPageHandler((msg) => {
          console.log(msg);
          globalRequestHandler(msg, this.router, this.messageService);
          if (msg.for === "getAllGeneralSaleBill") {
            this.users = msg.data
            this.isLoading = false
          } else if (msg.for == 'getAllCompanyDropdown') {
            this.companyList = msg.data;
          } else if (msg.for == 'getAllPartyDropdown') {
            this.partyList = msg.data;
          } else if (msg.for == 'getAllBranchDropdown') {
            this.branchList = msg.data;
          } else if (msg.for == "getAllCityDropdown") {
            this.cityList = msg.data;
          } else if (msg.for == 'createUpdateVendorMaster') {
            if (msg.StatusID === 1) {
              const updated = msg.data[0];  // access the first item in data array
    
              this.messageService.add({ severity: 'success', summary: 'Success', detail: msg.StatusMessage });
              this.showForm = false;
              this.form.reset();
    
              const index = this.users.findIndex((v: any) => v.id == updated.id);
              if (index !== -1) {
                this.users[index] = { ...updated };
              } else {
                this.users.push(updated)
              }
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: msg.StatusMessage });
            }
    
          } else if (msg.for === "deleteData") {
            if (msg.StatusMessage === "success") {
              const index = this.users.findIndex((v: any) => v.id == this.tablevalue.id);
              if (index !== -1) {
                this.users.splice(index, 1);
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
    this.generalSalebillService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
  }

  async ngAfterViewInit(): Promise<void> {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: '',
    };
    this.generalSalebillService.getAllGeneralSalebill(payload);

}

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Invoice No', field: 'InvNo', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Invoice Type', field: 'InvType', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Gross Amount', field: 'GrossAmt', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Invoice Date', field: 'InvDate', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Entry Date', field: 'EntryDate', icon: 'pi pi-car', styleClass: 'text-red-600' },
    { header: 'Due Date', field: 'DueDate', icon: 'pi pi-car', styleClass: 'text-red-600' },




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
        this.commonService.getAllCompanyDropdown();
        this.commonService.gateAllPartyNameDropdown();
        this.commonService.GatAllBranchDropDown({});
        this.commonService.GatAllCityDropDown({});
        break;
      case 'delete':
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD GENERAL'
        this.commonService.getAllCompanyDropdown();
        this.commonService.gateAllPartyNameDropdown();
        this.commonService.GatAllBranchDropDown({});
        this.commonService.GatAllCityDropDown({});
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
  filterCompany(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCompany = this.companyList.filter(company =>
      company.ShortName.toLowerCase().includes(query)
    );
  }
  filterParty(event: any) {
    const query = event.query.toLowerCase();
    this.filteredParty = this.partyList.filter(party =>
      party.party_name.toLowerCase().includes(query)
    );
  }
  filterBranch(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBranch = this.branchList.filter(branch =>
      branch.branch_name.toLowerCase().includes(query)
    );
  }
  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCity = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }


}
