import { Value } from 'regjsparser';
import { partyRateMasterService } from '../../../../services/partyRateMaster.service';
import { carTypeMasterService } from '../../../../services/carTypeMaster.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { getCurrentDate, getCurrentTime, getStringifiedFormValues, globalRequestHandler, } from '../../../../utils/global';
import { MessageService } from 'primeng/api';
import { commonService } from '../../../../services/comonApi.service';
import { partyMasterService } from '../../../../services/partyMaster.service';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { BookingService } from '../../../../services/booking.service';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-booking-entry',
  imports: [
    DialogModule,
    CommonModule,
    DividerModule,
    TableModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    TabViewModule,
    ReactiveFormsModule,
    FormsModule,
    PanelModule,
  ],
  templateUrl: './booking-entry.component.html',
  styleUrl: './booking-entry.component.css',
})
export class BookingEntryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private carTypeMaster: carTypeMasterService,
    private messageService: MessageService,
    private router: Router,
    private commonApiService: commonService,
    private bookingService: BookingService,
    private partyRateMasterService: partyRateMasterService,
    private fb: FormBuilder
  ) { }
  totalHours = 0;
  totalKM = 0;
  availableRates: any[] | undefined;
  charges: any[] = [];
  bookingFrom?: any;




  booking = {
    netAmount: 0,
    otherCharges: 0,
    totalAmount: 0
  };


  guests = [
    {
      name: '',
      contactNo: '',
      additionalContactNo: '',
      pickupAddress: '',
      dropAddress: '',
      remarks: '',
    },
  ];

guestList = [
  { name: 'John Doe', addressType: 'Home', contact: '9876543210', address: '123, Blue Street', additionalNo: '8800112233' },
  { name: 'Jane Smith', addressType: 'Work', contact: '9876512345', address: '45, Red Ave', additionalNo: '8811223344' }
];

  branches?: any[];
  cities?: any[];
  carTypes?: any[];

  carTypeSearch = '';

  partyRateTypes: any[] = [
    {
      label: 'Normal'
    },
    {
      label: 'Hrs'
    },
    {
      label: 'DayKM'
    },
    {
      label: 'Trn'
    },
  ];

  bookingModes = [
    { label: 'SMS', value: 'SMS' },
    { label: 'CALL', value: 'CALL' },
    { label: 'E-Mail', value: 'E-Mail' },
    { label: 'WhatsApp', value: 'WhatsApp' },
  ];

  selectRates = [];

  dutyTypes = [
    { label: 'DISPOSAL', value: '1' },
    { label: 'OUTSTATION', value: '2' },
    { label: 'PICKUP', value: '3' },
    { label: 'DROP', value: '4' },
  ];

  reportAt = [
    { label: 'RESIDENCE', value: 'RESIDENCE' },
    { label: 'OFFICE', value: 'OFFICE' },
    { label: 'HOTEL', value: 'HOTEL' },
    { label: 'RAILWAY STATION', value: 'RAILWAY STATION' },
    { label: 'AIRPORT', value: 'AIRPORT' },
    { label: 'OUTSTATION', value: 'OUTSTATION' },
    { label: 'OTHER', value: 'OTHER' },
  ];

  dropAt = [{ name: 'kolkata' }, { name: 'Haldia' }];

  // AutoComplete
  filteredCities: any[] = [];

  init() {
    this.bookingFrom = this.fb.group({
      id: ['0'],
      branch_id: ['', Validators.required],
      RentalDate: [''], // string, yyyy-MM-dd
      EntryDate: [getCurrentDate(), Validators.required], // string, dd-MM-yyyy
      ReportingDatetime: [getCurrentTime(), Validators.required], // string (hh:mm)
      SlipNo: ['New'],
      FromCityID: [''],
      EntryTime: [getCurrentTime(), Validators.required], // string
      ToCityID: [''],
      DutyType: [''], // string
      Party: [''], // string
      party_name: [''],
      ReportAt: [''],
      Email: [''],
      Flight_train_No: [''],
      Project: [''],
      DropAt: [''],
      CarType: [''], // string
      BookingMode: [''],
      BookedBy: [''],
      ContactNo: [''],
      BookedEmail: [''],
      Advance: ['0'],
      PartyRateType: [''],
      PartyRate: [''], // stringified number
      Price: ['0'],
      HourRate: ['0'], // stringified number
      KMRate: ['0'],    // stringified number
      IncludeTax: [''], // empty string
      discount_amount: this.fb.array([this.fb.control('')]),
      isCash: [''], // string

      // Optional extras preserved
      Branch: [''],
      SelectRate: [''],

    postJsonData: this.fb.array([
    this.createGuestFormGroup()
  ])

    });
  }

createGuestFormGroup(): FormGroup {
  return this.fb.group({
      id: '',
      GustName: "",
      ContactNo: "",
      Address: "",
      Remarks: "",
      AditionalContactNo: "",
      DropAddress: "",
      AddressLat: "",
      AddressLng: "",
      DropAddressLat: "",
      DropAddressLng: ""
  });
}



  filterCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.CityName.toLowerCase().includes(query)
    );
    console.log(this.filteredCities)
  }

  filteredToCities: any[] = [];

  filterToCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredToCities = this.cities.filter((city) =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  filteredCarTypes: any[] = [];

  filterCarTypes(event: any) {
    if (!this.carTypes) return;
    const query = event.query.toLowerCase();
    this.filteredCarTypes = this.carTypes.filter((type) =>
      type.car_type.toLowerCase().includes(query)
    );
    // console.log(this.filteredCarTypes)
  }

  filteredCarTypeSend: any[] = [];

  filterCarTypeSend(event: any) {
    if (!this.carTypes) return;
    const query = event.query.toLowerCase();
    this.filteredCarTypeSend = this.carTypes.filter((type) =>
      type.car_type.toLowerCase().includes(query)
    );
  }

  filteredBranches: any[] = [];

  filterBranches(event: any) {
    if (!this.branches) return;
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter((branch) =>
      branch.branch_name.toLowerCase().includes(query)
    );
  }

  // AutoComplete
  PartyName: any[] = []; // original full list
  filteredPartyName: any[] = []; // used by the autocomplete

  filterPartyName(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredPartyName = this.PartyName.filter((party) => {
      const name = party.party_name?.toLowerCase() || '';
      return name.includes(query);
    });
  }

  ngOnInit(): void {


    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          rt = true;
        } else if (msg.for === 'getAllCityDropdown') {
          this.cities = msg.data;
          rt = true;
        } else if (msg.for === 'getAllBranchDropdown') {
          this.branches = msg.data;
          rt = true;
        } else if (msg.for === 'getAllPartyDropdown') {
          this.PartyName = msg.data;
          rt = true;
        } else if (msg.for === 'getallpartyrate') {
          this.selectRates = msg.data;
          console.log(this.selectRates);
          rt = true;
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });

    this.getCarTypeName();
    this.getAllCity();
    this.getAllBranches();
    this.getAllParty();
    this.init();
  }


  addGuest() {
    this.LGuest.push(this.createGuestFormGroup());
  }

  removeGuest(index: number) {
    this.LGuest.removeAt(index);
  }


  closeForm() {
    // Handle form close logic here
    console.log('Form Closed');
  }

  addCharge() {
    this.charges.push({ name: '', amount: 0, image: null });
  }

  removeCharge(index: number) {
    this.charges.splice(index, 1);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.charges[index].image = file;
    }
  }


  onFileSelectedGuest(event: any) {
    // Handle file selection logic
  }

  // API CALLS
  getCarTypeName() {
    // console.log('getCarTypeName');
    this.carTypeMaster.GateAllCarType({
      PageNo: 1,
      PageSize: 10,
      Search: this.carTypeSearch,
    });
  }

  getAllCity() {
    this.commonApiService.GatAllCityDropDown({});
  }

  getAllBranches() {
    this.commonApiService.GatAllBranchDropDown({});
  }

  getAllParty() {
    this.commonApiService.gateAllPartyNameDropdown();
  }

  getAllPartyRate() {
    this.partyRateMasterService.getAllPartyRate({
      "city_id": this.bookingFrom?.get('FromCityID').value,
      "party_id": this.bookingFrom?.get('Party').value,
      "car_type_id": this.bookingFrom?.get('CarType').value,
      "duty_type": this.bookingFrom?.get('DutyType').value,
    })
  }


  // OnSelect Functions
  onBranchSelect(branch: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('branch_id').setValue(branch.value.Id);
    }
  }

  onCitySelect(city: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('FromCityID').setValue(city.value.Id);
    }
    console.log(city);
  }

  onToCitySelect(city: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('ToCityID').setValue(city.value.Id);
    }
     console.log(city);
  }


  onPartyNameSelect(party: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('Party').setValue(party.value.id);
    }
  }


  onCarTypeSelect(cartype: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('CarType').setValue(cartype.value.id);
    }
  }

  changePartyRateType() {
    this.getAllPartyRate();
  }

   guestListVisible = false;

  showGuestList() {
    this.guestListVisible = true;
  }


  submitBooking() {
    if (this.bookingFrom.valid) {
      console.log(this.bookingFrom.value);
      this.bookingService.create((this.bookingFrom.value));
    } else {
      // Show validation errors
      console.warn('Form is invalid');
      this.bookingFrom.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }

  get LGuest(): FormArray {
    return this.bookingFrom.get('LGuest') as FormArray;
  }
}
