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
  showOption = false;
  previewData: any[] = [];
  editIndex: number | null = null;
  tablevalue: any;
  carTypes = [];

  rateTypes = [
    { label: 'Normal', value: 'Normal' },
    { label: 'HRS/KM slab', value: 'Hrs' },
    { label: 'Day/KM', value: 'DayKM' },
    { label: 'Transfer', value: 'Trn' }
  ];

  selectedRateType: string = this.rateTypes[0].value;

  get filteredData() {
    return this.previewData?.filter(row => row.TabVal === this.selectedRateType) || [];
  }

  onTabChange(event: any) {
    this.selectedRateType = this.rateTypes[event.index].value;
  }



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
      } else if (msg.for === 'getAllPartyDropdown') {
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

      } else if (msg.for === "getAllCartypeMasterDropdown") {
        this.carTypes = msg.data;
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

  loadPartyNameDropdown() {
    this.comonApiService.gateAllPartyNameDropdown();
  }

  createForm() {
    this.form = this.fb.group({
      id: [0],
      car_type: [''],
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
    });


    this.partyRateForm = this.fb.group({
      id: [0],
      city_id: [''],
      party_id: [''],
      PartyAddr: [''],
      PinCode: [''],
      GSTNo: [''],
      ContactPersonName: [''],
      ContactNo: [''],
      EMailID: ['', [Validators.email]],
    });
  }


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
        this.comonApiService.getallCartype();
        this.loadPartyNameDropdown();
        break;
      case 'delete':
        this.deletePartyRate(event.data)
        this.tablevalue = event.data
        break;
      case 'add':
        this.comonApiService.getallCartype();
        this.loadPartyNameDropdown()
        this.addNewPartyRate();
        break;
    }
  }

  async editPartyRate(data: any) {
    this.heading = 'UPDATE PARTY RATE';
    this.showForm = true;
    const city = this.CityName.find(c => c.Id == data.city_id);

    console.log('City:', city);

    this.partyRateForm.patchValue({
      city_id: city,
      ...data
    });
    // If data.partyratesummery is a JSON string
    const parsedData = JSON.parse(data.partyratesummery);

    // Make sure it's an array before pushing
    if (Array.isArray(parsedData)) {
      this.previewData = [...parsedData];
    } else {
      this.previewData = [parsedData];
    }

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


  viewOption() {
    this.showOption = !this.showOption;
  }

  updateRateTypeValidators(type: string) {
    const fields = {
      Normal: ['hourRate', 'kmRate', 'minHrs', 'minKm'],
      'HRS/KM slab': ['hours', 'slabKm', 'slabAmount', 'extraHoursRate', 'extraKmRate'],
      'Day/KM': ['dayKm', 'dayAmount', 'dayExtraKmRate'],
      'Transfer': ['transferType', 'transferAmount']
    }
  };

  onFloatingFormSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      console.log("value", formValue)
      if (this.editIndex !== null) {
        this.previewData[this.editIndex] = formValue;
        this.editIndex = null;
      } else {
        let rawDate = this.form.get('RtEfDate')?.value;
        let formattedDate = null;

        if (rawDate) {
          if (typeof rawDate === 'string') {
            rawDate = new Date(rawDate);
          }

          formattedDate = `${rawDate.getFullYear()}-${(rawDate.getMonth() + 1).toString().padStart(2, '0')}-${rawDate.getDate().toString().padStart(2, '0')}`;
        }

        this.previewData.push({
          ...this.form.value,
          RtEfDate: formattedDate
        });
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

  onEditRow(row: any) {
    this.showForm = true;
    this.form.reset();

    console.log("row", row)


    // If your form control names differ from row keys, map them:
    const patch = {
      car_type: Number(row.car_type),
      KM: row.KM ?? null,
      Amount: row.Amount ?? null,
      MinHr: row.MinHr ?? null,
      MinKm: row.MinKm ?? null,
      IncludeTax: row.IncludeTax ?? null,
      RtEfDate: row.RtEfDate ? new Date(row.RtEfDate) : null,
      NHTime: row.NHTime ?? null,
      NHAmount: row.NHAmount ?? null,
      EHTime: row.EHTime ?? null,
      EHAmount: row.EHAmount ?? null,
      ExtKmrate: row.ExtKmrate ?? null,
      ExtHrrate: row.ExtHrrate ?? null,
      TransType: row.TransType ?? null,
      HigherRate: row.HigherRate ?? null,
      TabVal: row.TabVal ?? null
    };

    this.form.patchValue(patch);

    // if you still want to keep an edit index, compute it once from current list
    this.editIndex = this.filteredData
      ? this.filteredData.findIndex(r => r === row || r.id === row.id)
      : -1;

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
    console.log("save party ")
    if (this.form.invalid) {
      this.form.touched
      this.messageService.add({ severity: "warning", summary: "warning", detail: 'Invalid Form Data' })
      return;
    }
    const payload = {
      ...this.partyRateForm.value,
      city_id: this.partyRateForm.value.city_id?.Id,
      ContactNo: "" + this.partyRateForm.value.ContactNo,
      PinCode: "" + this.partyRateForm.value.PinCode,
      postJsonData: this.previewData
    }
    this.partyRateMasterService.createUpdatePartyRate(payload);
    console.log(payload);
  }
}