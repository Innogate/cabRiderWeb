import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, input, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../../utils/global';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { commonService } from '../../../services/comonApi.service';
import { monthlyDutyMasterService } from '../../../services/monthlyDutyMaster.service';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-monthly-duty-master',
  imports: [CommonModule, DynamicTableComponent, ReactiveFormsModule, DropdownModule, AutoCompleteModule,InputTextModule,CheckboxModule],
  templateUrl: './monthly-duty-master.component.html',

  styleUrl: './monthly-duty-master.component.css'
})
export class MonthlyDutyMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  data: any[] = [];
  isLoading: boolean = true;
  showForm: boolean = false;
  form!: FormGroup;
  heading: string = '';
  cities: any[] = [];
  filteredCities: any[] = [];
  cityList: any[] = [{ Id: 0, CityName: '' }];
  branch: any[] = [];
  filteredBranch: any[] = [];
  branchList: any[] = [];
  party: any[] = [];
  filteredParty: any[] = [];
  partyList: any[] = [{ Id: 0, party_name: '' }];
  carTypeList: any[] = [];
  filteredCartype: any[] = [];
  days: any[] = [
    { name: 'Sunday' },
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
  ];

  filteredDays: any[] = [];
  tablevalue: any;



  constructor(
    private monthlyDutyMasterService: monthlyDutyMasterService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commonService: commonService,

  ) { this.createForm() }

  createForm() {
    this.form = this.fb.group({
      id: 0,
      BranchID: [''],
      PartyID: [''],
      UsedBy: [''],
      CityID: [''],
      CarTypeID: [''],
      CarNo: ['', ],
      SetupType: [''],
      DutyAmt: [''],
      NoofDays: [''],
      ExceptDay: [''],
      OutStationDuty: [''],
      ExtraDayHrRate: [''],
      ExtraDayKMRate: [''],
      ExtraDayMinHr: [''],
      CompareKMTime: [''],
      FromTime: [''],
      ToTime: [''],
      TotHrs: [''],
      ExtraMonthHrsRate: [''],
      TotalKM: [''],
      KMRate: [''],
      OTRate: [''],
      NightAmt: [''],
      OutNightRt: [''],
      FuelRt: [''],
      MobilRt: [''],
      FuelAvrg: [''],
      MobilAvrg: [''],
      NHaltTime: [''],
      GrgOutTime: [''],
      GrgInTime: [''],
      GrgOutKM: [''],
      GrgInKM: [''],
      CalcOnRptTime: [''],
      OutStationAmt: [''],
      ExtraDesc: [''],
      ExtraAmt: [''],
      PerDayAmt: [''],

    });
  }



  ngOnInit(): void {
    this.monthlyDutyMasterService.registerPageHandler((msg) => {
      console.log(msg);
      globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === "getAllMonthlyDutyList") {
        this.data = msg.data;
        this.isLoading = false;
      } else if (msg.for == 'getAllCityDropdown') {
        this.cityList = msg.data;
      } else if (msg.for == 'getAllBranchDropdown') {
        // this.filteredBranch = msg.data;
        this.branchList = msg.data;
      } else if (msg.for == 'getAllPartyDropdown') {
        this.partyList = msg.data;
      } else if(msg.for === 'getAllCartypeMasterDropdown'){
        this.carTypeList = msg.data;
      } else if (msg.for == 'createUpdateMonthlyDutyMaster') {
        if (msg.StatusID === 1) {
          const updated = msg.data[0]; 

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
    this.monthlyDutyMasterService.unregisterPageHandler();
    this.commonService.unregisterPageHandler();
  }

  ngAfterViewInit(): void {
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 100,
      Search: "",
    };
    this.monthlyDutyMasterService.getAllMonthlyDuty(payload);
  }





  // Define the columns for the dynamic table
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Duty NO', field: 'DutyNo', icon: 'pi pi-list', styleClass: 'text-green-600' },
    { header: 'Car No', field: 'CarNo', icon: 'pi pi-car', styleClass: 'text-indigo-500' },
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
        this.commonService.GatAllCityDropDown({});
        this.commonService.GatAllBranchDropDown({});
        this.commonService.gateAllPartyNameDropdown();
        this.commonService.getallCartype();
        this.heading = 'EDIT CAR TYPE'
        break;
      case 'delete':
        break;
      case 'add':
        this.showForm = true;
        this.form.reset();
        this.commonService.GatAllCityDropDown({});
        this.commonService.GatAllBranchDropDown({});
        this.commonService.gateAllPartyNameDropdown();
        this.commonService.getallCartype();
        this.heading = 'ADD CAR TYPE'
        break
    }
  }





  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cityList.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  filteredPartylist(event: any) {
    const query = event.query.toLowerCase();
    this.filteredParty = this.partyList.filter(party =>
      party.party_name.toLowerCase().includes(query)
    );
  }

  filterbranchlist(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBranch = this.branchList.filter(branch =>
      branch.branch_name?.toLowerCase().includes(query)
    );
  }


  filterDay(event: any) {
    const query = event.query.toLowerCase();
    this.filteredDays = this.days.filter(day =>
      day.name.toLowerCase().includes(query)
    );
  }
  filterCarTypelist(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCartype = this.carTypeList.filter(cartype =>
      cartype.car_type?.toLowerCase().includes(query)
    );
  }


  setuptypeOptions = [
    { label: "Day Basis", value: "Day Basis" },
    { label: "Monthly Basis", value: "Monthly Basis" },
    { label: "Per Day Basis", value: "Per Day Basis" },
  ];

  outStationdutyOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];


   saveMonthly() {
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' })
      return;
    }
    const payload = {
            ...this.form.value,
        BranchID: this.form.value.BranchID?.Id,
        PartyID: this.form.value.PartyID?.id,
        CarTypeID: this.form.value.CarTypeID?.id,
        id: this.form.value.id
    }
    // this.monthlyDutyMasterService.createUpdateMonthlyDuty(payload)
    console.log(payload)
  }
}

