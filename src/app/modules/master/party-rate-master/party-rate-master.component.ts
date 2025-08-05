import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { partyRateMasterService } from '../../../services/partyRateMaster.service';
import { globalRequestHandler } from '../../../utils/global';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { commonService } from '../../../services/comonApi.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray, AbstractControl } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-party-rate-master',
  standalone: true,
  imports: [
    DynamicTableComponent,
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    DropdownModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    TabViewModule,
    CalendarModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    DialogModule,
  ],
  templateUrl: './party-rate-master.component.html',
  styleUrls: ['./party-rate-master.component.css']
})
export class PartyRateMasterComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  data: any[] = [];
  showForm = false;
  heading = '';
  partyName: any[] = [];
  CityName: any[] = [];
  form!: FormGroup;
  partyRateForm!: FormGroup;
  filteredCities: any[] = [];
  showCustomPanel = false;
  activeTabIndex = 0;
  tabFormArrays: { [key: string]: FormArray };
  showOption = false;
  previewData: any[] = [];
  editIndex: number | null = null;
  tablevalue: any;


  tabs = ['Normal', 'HRS/KM slab', 'Day/KM', 'Transfer'];
  currentTabType = this.tabs[0];

  // Store separate form arrays for each tab


  rateTypes = [
    { label: 'Normal', value: 'Normal' },
    { label: 'HRS/KM slab', value: 'HRS/KM slab' },
    { label: 'Day/KM', value: 'Day/KM' },
    { label: 'Transfer', value: 'Transfer' }
  ];

  


  carTypes = [
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Tempo Traveller', value: 'Tempo Traveller' },
    { label: 'Bus', value: 'Bus' }
  ];

  transferTypes = [
    { label: 'Local', value: 'Local' },
    { label: 'Outstation', value: 'Outstation' },
    { label: 'Airport', value: 'Airport' }
  ];

  includeTaxOptions = [
    { label: 'Yes', value: 'Y' },
    { label: 'No', value: 'N' }
  ];

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Party Name', field: 'party_name', icon: 'pi pi-user', styleClass: 'text-red-600' },
    { header: 'City Name', field: 'cityname', icon: 'pi pi-map-marker', styleClass: 'text-green-600' },
  ];

  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];

  constructor(
    private partyRateMasterService: partyRateMasterService,
    private router: Router,
    private messageService: MessageService,
    private comonApiService: commonService,
    private fb: FormBuilder
  ) {
    this.tabFormArrays = {
      'Normal': this.fb.array([]),
      'HRS/KM slab': this.fb.array([]),
      'Day/KM': this.fb.array([]),
      'Transfer': this.fb.array([])
    };
    this.createForm();
  }
  ngOnInit(): void {
    this.partyRateMasterService.registerPageHandler((msg: any) => {
      console.log(msg)
      globalRequestHandler(msg, this.router, this.messageService);
      
      if (msg.for === 'getallpartyrate') {
        this.data = msg.data;
        this.isLoading = false;
      } else if (msg.for === 'getAllCityDropdown') {
        this.CityName = msg.data;
      } else if(msg.for === 'getAllPartyDropdown'){
        this.partyName = msg.data
      } else if (msg.for == 'createUpdatePartyRate') {
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
      return true;
    });
  }

  ngOnDestroy(): void {
    this.partyRateMasterService.unregisterPageHandler();
    this.comonApiService.unregisterPageHandler();
  }

  ngAfterViewInit(): void {
    this.loadPartyRates();
    this.loadCities();
    this.loadPartyNameDropdown();
  }



    loadPartyRates() {
    this.isLoading = true;
    const payload = { id: 0, PageNo: 1, PageSize: 1000, Search: "" };
    this.partyRateMasterService.getAllPartyRate(payload);
  }

  loadPartyNameDropdown(){
      this.comonApiService.gateAllPartyNameDropdown();
  }

  createForm() {
    this.form = this.fb.group({
      id: [0],
      car_type: ['', Validators.required],
      HigherRate: [''],
      Hours: [''],
      KM: [''],
      KMR: [''],
      NHTime: [''],
      EHTime: [''],
      NHAmount: [''],
      EHAmount: [''],
      MinHr: [''],
      MinKm: [''],
      RtEfDate: [''],
      Amount: [''],
      ExtHrrate: [''],
      ExtKmrate: [''],
      TransType: [''],
      TabVal: [''],
      IncludeTax: [''],
      rateType: [''],
    });


    this.partyRateForm = this.fb.group({
      city_id: ['', Validators.required],
      party_id: [''],
      PartyAddr: [''],
      PinCode: [''],
      GSTNo: [''],
      ContactPersonName: [''],
      ContactNo: ['', [Validators.pattern('[0-9]{10}')]],
      EMailID: ['', [Validators.email]],
    });
  }

  get currentTabArray(): FormArray {
    return this.tabFormArrays[this.form.get('currentTab')?.value];
  }

  createRateRow(tabType: string): FormGroup {
    const baseControls: Record<string, any> = {
      carType: [null, Validators.required],
      includeTax: [null, Validators.required],
      rateEffectDate: [null],
      nightHaltTime: [null],
      nightHaltAmount: [0, Validators.min(0)],
      earlyHaltTime: [null],
      earlyHaltAmount: [0, Validators.min(0)],
      type: [tabType],
      hourRate: [null],
      kmRate: [null],
      minHrs: [null],
      minKm: [null],
      hours: [null],
      km: [null],
      amount: [null],
      extraHoursRate: [null],
      extraKmRate: [null],
      whicheverHigher: [false],
      transferType: [null]
    };

    // Add tab-specific validators
    switch (tabType) {
      case 'Normal':
        baseControls['hourRate'] = [null, [Validators.required, Validators.min(0)]];
        baseControls['kmRate'] = [null, [Validators.required, Validators.min(0)]];
        baseControls['minHrs'] = [null, [Validators.required, Validators.min(1)]];
        baseControls['minKm'] = [null, [Validators.required, Validators.min(1)]];
        break;
      case 'HRS/KM slab':
        baseControls['hours'] = [null, [Validators.required, Validators.min(1)]];
        baseControls['km'] = [null, [Validators.required, Validators.min(1)]];
        baseControls['amount'] = [null, [Validators.required, Validators.min(0)]];
        baseControls['extraHoursRate'] = [null, [Validators.required, Validators.min(0)]];
        baseControls['extraKmRate'] = [null, [Validators.required, Validators.min(0)]];
        break;
      case 'Day/KM':
        baseControls['km'] = [null, [Validators.required, Validators.min(1)]];
        baseControls['amount'] = [null, [Validators.required, Validators.min(0)]];
        baseControls['extraKmRate'] = [null, [Validators.required, Validators.min(0)]];
        break;
      case 'Transfer':
        baseControls['transferType'] = [null, Validators.required];
        baseControls['amount'] = [null, [Validators.required, Validators.min(0)]];
        break;
    }

    return this.fb.group(baseControls);
  }

  addRow(tabType: string = this.form.get('currentTab')?.value) {
    this.tabFormArrays[tabType].push(this.createRateRow(tabType));
  }

  // removeRow(index: number) {
  //   if (this.currentTabArray.length > 1) {
  //     this.currentTabArray.removeAt(index);
  //   } else {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: 'At least one row is required'
  //     });
  //   }
  // }

  filterCity(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCities = this.CityName.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.editPartyRate(event.data);
        this.loadPartyNameDropdown();
        break;
      case 'delete':
        this.deletePartyRate(event.data)
        this.tablevalue=event.data
        break;
      case 'add':
        this.loadPartyNameDropdown()
        this.addNewPartyRate();
        break;
    }
  }

  editPartyRate(data: any) {
    this.heading = 'UPDATE PARTY RATE';
    this.showForm = true;
    const city = this.CityName.find(c => c.Id == data.city_id);

    this.form.patchValue({
      city_id: city,
      party_id: data.party_id,
      PartyAddr: data.PartyAddr,
      PinCode: data.PinCode,
      GSTNo: data.GSTNo,
      ContactPersonName: data.ContactPersonName,
      ContactNo: data.ContactNo,
      EMailID: data.EMailID
    });
  }

  addNewPartyRate() {
    this.heading = 'ADD PARTY RATE';
    this.showForm = true;
    this.form.reset();
  }

  deletePartyRate(id: number) {
    console.log('Delete party rate with id:', id);
    // Implement your delete logic here
  }


  loadCities() {
    this.comonApiService.GatAllCityDropDown({});
  }

  toggleCustomPanel() {
    this.showCustomPanel = !this.showCustomPanel;
  }

  // onTabChange(event: TabViewChangeEvent) {
  //   this.activeTabIndex = event.index;
  //   this.currentTabType = this.tabs[this.activeTabIndex];
  //   this.form.get('currentTab')?.setValue(this.currentTabType);
  // }

  // logData() {
  //   console.log('Form data:', {
  //     ...this.form.value,
  //     rates: this.getAllTabData()
  //   });
  // }

  // getAllTabData() {
  //   const allData: any[] = [];
  //   this.tabs.forEach(tab => {
  //     this.tabFormArrays[tab].controls.forEach((control: AbstractControl) => {
  //       if (control instanceof FormGroup) {
  //         allData.push({
  //           ...control.value,
  //           type: tab
  //         });
  //       }
  //     });
  //   });
  //   return allData;
  // }

  // save() {
  //   if (this.form.valid) {
  //     const formData = {
  //       ...this.form.value,
  //       rates: this.getAllTabData()
  //     };

  //     console.log("Saving data:", formData);
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'Party rate saved successfully'
  //     });

  //     this.showForm = false;
  //     this.loadPartyRates();
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Please fill all required fields correctly'
  //     });
  //     this.markAllAsTouched();
  //   }
  // }

  // markAllAsTouched() {
  //   this.form.markAllAsTouched();
  //   this.tabs.forEach(tab => {
  //     this.tabFormArrays[tab].controls.forEach(group => {
  //       group.markAllAsTouched();
  //     });
  //   });
  // }

  viewOption() {
    this.showOption = !this.showOption;
  }

  updateRateTypeValidators(type: string) {
  const fields = {
    Normal: ['hourRate', 'kmRate', 'minHrs', 'minKm'],
    'HRS/KM slab': ['hours', 'slabKm', 'slabAmount', 'extraHoursRate', 'extraKmRate'],
    'Day/KM': ['dayKm', 'dayAmount', 'dayExtraKmRate'],
    'Transfer': ['transferType', 'transferAmount']
  }};

  onFloatingFormSubmit() {
  if (this.form.valid) {
    const formValue = { ...this.form.value };

    if (this.editIndex !== null) {
      this.previewData[this.editIndex] = formValue;
      this.editIndex = null;
    } else {
      this.previewData.push(formValue);
    }

    this.showOption = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data saved successfully'
    });

    this.form.reset();
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill required fields'
    });
    this.form.markAllAsTouched();
  }
}


onEditRow(index: number) {
  this.showForm = true;
  this.form.patchValue(this.previewData[index]);
  this.editIndex = index;
  this.showOption = true;
}

onDeleteRow(index: number) {
  this.previewData.splice(index, 1); // Remove the row
  this.messageService.add({
    severity: 'info',
    summary: 'Deleted',
    detail: 'Row deleted successfully'
  });
}


savePartyRate() {
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' })
      return;
    }
    const payload = {
      ...this.form.value,
      // city_id: this.form.value.city_id?.Id,
      // pin_code: "" + this.form.value.pin_code,
      // mobileno: "" + this.form.value.mobileno,
      // whatsappno: "" + this.form.value.whatsappno,
      // bank_acno: "" + this.form.value.bank_acno,
      // phone_no: "" + this.form.value.phone_no,
    }
    this.partyRateMasterService.createUpdatePartyRate(payload)
  }


  
}