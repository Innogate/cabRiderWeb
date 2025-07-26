import { Value } from 'regjsparser';
import { partyRateMasterService } from '../../../../services/partyRateMaster.service';
import { carTypeMasterService } from '../../../../services/carTypeMaster.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators, } from '@angular/forms';
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
@Component({
  selector: 'app-booking-entry',
  imports: [
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
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' },
  ];

  selectRates?: any[];

  dutyTypes = [{ name: 'Local' }, { name: 'Outstation' }];

  dropAt = [{ name: 'kolkata' }, { name: 'Haldia' }];

  // AutoComplete
  filteredCities: any[] = [];

  init() {
    this.bookingFrom = this.fb.group({
      id: [0],
      Branch: [''], // -> Added
      branch_id: [null, Validators.required],
      EntryDate: [getCurrentDate(), Validators.required],
      EntryTime: [getCurrentTime(), Validators.required],
      RentalDate: [''],
      SlipNo: ['NEW'],
      FromCityID: ['1'],
      ReportingDatetime: [getCurrentTime(), Validators.required],
      ToCityID: ['1'],
      DutyType: [''], // null, Validators.required
      Party: [''],
      ReportAt: [''],
      Email: [''],
      Flight_train_No: [''],
      Project: [''],
      DropAt: [''],
      CarType: [''], //null, Validators.required
      BookingMode: [''],
      BookedBy: [''],
      ContactNo: [''],
      BookedEmail: [''],
      Advance: [0],
      PartyRateType: [''],   // null, Validators.required
      PartyRate: [0],
      Price: [0],
      HourRate: [0],
      KMRate: [0],
      LGustName: [''],
      lid: [''],
      LContactNo: [''],
      LContactNo2: [''],
      LAddress: [''],
      LDropAddress: [''],
      LRemarks: [''],
      discount_amount: [''],
      isCash: [0],
      // missing
      SelectRate: [0],
    });

  }


  filterCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.CityName.toLowerCase().includes(query)
    );
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
    this.guests.push({
      name: '',
      contactNo: '',
      additionalContactNo: '',
      pickupAddress: '',
      dropAddress: '',
      remarks: '',
    });
  }

  removeGuest(index: number) {
    this.guests.splice(index, 1);
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
    this.partyRateMasterService.GatAllPartyRate({
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
    // console.log(city);
  }

  onToCitySelect(city: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('ToCityID').setValue(city.value.Id);
    }
    // console.log(city);
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

  submitBooking() {
    if (this.bookingFrom.valid || true) {
      console.log('Submitted Form Values:', this.bookingFrom.value);
      this.bookingService.create(getStringifiedFormValues({
        "id": 0,
        "Branch": "",
        "branch_id": 17,
        "EntryDate": "26-07-2025",
        "EntryTime": "12:13",
        "RentalDate": "2025-07-27",
        "SlipNo": "NEW",
        "FromCityID": "1",
        "ReportingDatetime": "12:13",
        "ToCityID": "1",
        "DutyType": "Local",
        "Party": 2,
        "ReportAt": "",
        "Email": "tuhin@email.com",
        "Flight_train_No": "",
        "Project": "",
        "DropAt": "",
        "CarType": 1769,
        "BookingMode": "Online",
        "BookedBy": "Amit",
        "ContactNo": "1234567890",
        "BookedEmail": "tuhin@email.com",
        "Advance": 0,
        "PartyRate": 0,
        "Price": 0,
        "HourRate": 0,
        "KMRate": 0,
        "LGustName": "",
        "lid": "",
        "LContactNo": "",
        "LContactNo2": "",
        "LAddress": "",
        "LDropAddress": "",
        "LRemarks": "",
        "discount_amount": "",
        "isCash": 0,
        "SelectRate": 85
      }));
    } else {
      // Show validation errors
      console.warn('Form is invalid');
      this.bookingFrom.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }


}

// * REQUIRED FORM DATA

// {
//   "id": "120802",
//   "branch_id": "17",
//   "EntryDate": "26-07-2025",
//   "EntryTime": "13:58",
//   "RentalDate": "2025-07-26",
//   "SlipNo": "LC26072025-67",
//   "FromCityID": "1",
//   "ReportingDatetime": "13:58",
//   "ToCityID": "1",
//   "DutyType": "2",
//   "Party": "2",
//   "ReportAt": "Office",
//   "Email": "TEST@EMAIL.COM",
//   "Flight_train_No": "",
//   "Project": "",
//   "DropAt": "",
//   "CarType": "29",
//   "BookingMode": "SMS",
//   "BookedBy": "XEONAMIT@GMAIL.COM",
//   "ContactNo": "8877878",
//   "BookedEmail": "test@gmail.com",
//   "Advance": "0",
//   "PartyRateType": "Normal",
//   "PartyRate": "593",
//   "Price": "0",
//   "HourRate": "250",
//   "KMRate": "25",
//   "LGustName": ["SHANKAR DAS"],
//   "lid": ["120530", "0"],
//   "LContactNo": [""],
//   "LContactNo2": [""],
//   "LAddress": ["19, R.N.MUKHERJEE ROAD, 1ST FLOOR"],
//   "LDropAddress": [""],
//   "LRemarks": ["SEND CLEAN CAR WITH NEWSPAPER"],
//   "discount_amount": [""],
//   "isCash": "0"
// }


// ! SENDING FORMATE DATA


      //   "id": 0,
      //   "Branch": "",
      //   "branch_id": 17,
      //   "EntryDate": "26-07-2025",
      //   "EntryTime": "12:13",
      //   "RentalDate": "2025-07-27",
      //   "SlipNo": "NEW",
      //   "FromCityID": "1",
      //   "ReportingDatetime": "12:13",
      //   "ToCityID": "1",
      //   "DutyType": "Local",
      //   "Party": 2,
      //   "ReportAt": "",
      //   "Email": "tuhin@email.com",
      //   "Flight_train_No": "",
      //   "Project": "",
      //   "DropAt": "",
      //   "CarType": 1769,
      //   "BookingMode": "Online",
      //   "BookedBy": "Amit",
      //   "ContactNo": "1234567890",
      //   "BookedEmail": "tuhin@email.com",
      //   "Advance": 0,
      //   "PartyRate": 0,
      //   "Price": 0,
      //   "HourRate": 0,
      //   "KMRate": 0,
      //   "LGustName": "",
      //   "lid": "",
      //   "LContactNo": "",
      //   "LContactNo2": "",
      //   "LAddress": "",
      //   "LDropAddress": "",
      //   "LRemarks": "",
      //   "discount_amount": "",
      //   "isCash": 0,
      //   "SelectRate": 85
      // }
