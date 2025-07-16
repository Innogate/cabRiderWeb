import { Value } from './../../../../node_modules/regjsparser/parser.d';
import { partyRateMasterService } from './../../services/partyRateMaster.service';
import { carTypeMasterService } from './../../services/carTypeMaster.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import {FormBuilder,FormsModule,NgModel,ReactiveFormsModule,Validators,} from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { ToggleButton } from 'primeng/togglebutton';
import { ActivatedRoute, Router } from '@angular/router';
import {getCurrentDate,getCurrentTime,globalRequestHandler,} from '../../utils/global';
import { MessageService } from 'primeng/api';
import { commonService } from '../../services/comonApi.service';
import { partyMasterService } from '../../services/partyMaster.service';
import { DividerModule } from 'primeng/divider';

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
    ToggleButton,
    ReactiveFormsModule,
    FormsModule,
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
    private partyMasterService: partyMasterService,
    private partyRateMasterService: partyRateMasterService,
    private fb: FormBuilder
  ) {}
  totalHours = 0;
  totalKM = 0;
  filteredVendors: any[] = [];
  availableRates: any[] | undefined;
  charges: any[] = [];
  vendorCharges: { name: string; amount: number }[] = [];
  totalVendorHours = 0;
  totalVendorKM = 0;

  isFullBooking: boolean = false;

  bookingFrom?: any;
  fullBookingFrom?: any;


  dateFields = [
    {
      label: 'Garage Out Date',
      dateModel: 'GarageOutDate',
      kmLabel: 'Garage Out KM',
      kmModel: 'GarageOutKm',
    },
    {
      label: 'Report Date',
      dateModel: 'ReportDate',
      kmLabel: 'Report KM',
      kmModel: 'ReportKm',
    },
    {
      label: 'Releasing Date',
      dateModel: 'ReleasingDate',
      kmLabel: 'Releasing KM',
      kmModel: 'ReleaseKm',
    },
    {
      label: 'Garage In Date',
      dateModel: 'GarageInDate',
      kmLabel: 'Garage In KM',
      kmModel: 'GarageInKm',
    },
  ];

  vendorDateFields = [
    {
      label: 'Garage Out Date',
      dateModel: 'VendorGarageOutDate',
      kmLabel: 'Garage Out Km',
      kmModel: 'VendorGarageOutKm',
    },
    {
      label: 'Report Date',
      dateModel: 'VendorReportDate',
      kmLabel: 'Report KM',
      kmModel: 'VendorReportKm',
    },
    {
      label: 'Release Date',
      dateModel: 'VendorReleasingDate',
      kmLabel: 'Release KM',
      kmModel: 'VendorReleaseKm',
    },
    {
      label: 'Garage In Date',
      dateModel: 'VendorGarageInDate',
      kmLabel: 'Garage In Km',
      kmModel: 'VendorGarageInKm',
    },
  ];

  booking = {
  netAmount: 0,
  otherCharges: 0,
  totalAmount: 0
};


  vendorBooking = {
    vendorRateType: null,
    selectedRate: null,
    vendorOut: null,
    vendorOutKM: 0,
    reportDate: null,
    reportKM: 0,
    releaseDate: null,
    releaseKM: 0,
    vendorIn: null,
    vendorInKM: 0,
    kmRate: 0,
    hourRate: 0,
    price: 0,
    advance: 0,
    cash: false,
    netAmount: 0,
    otherCharges: 0,
    totalAmount: 0,
    extraHourRate: 0,
    extraHourAmount: 0,
    extraKmRate: 0,
    extraKmAmount: 0,
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

  others = {
    reportAt: null,
    bookingMode: null,
    billTo: null,
    email: '',
    bookedByEmail: '',
    flightTrainNo: '',
    dropAt: '',
    otherReportAt: '',
    releaseAt: '',
  };

  reportOptions = [
    { label: 'Morning', value: 'Morning' },
    { label: 'Evening', value: 'Evening' },
  ];
  bookingModes = [
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' },
  ];
  billToOptions = [
    { label: 'Bill To Company', value: 'Bill To Company' },
    { label: 'Bill To Guest', value: 'Bill To Guest' },
  ];

  branches?: any[];
  cities?: any[];
  carTypes?: any[];

  carTypeSearch = '';

  partyRateTypes: any[] = [
    {
      label: 'Normal',
      value: 'Normal',
    },
    {
      label: 'Hrs',
      value: 'Hrs',
    },
    {
      label: 'DayKM',
      value: 'DayKM',
    },
    {
      label: 'Trn',
      value: 'Trn',
    },
  ];

  vendorRateTypes = [{ name: 'Hourly' }, { name: 'KM Based' }];

 selectRates: any[] = [
  { id: 1, name: 'Standard Rate' },
  { id: 2, name: 'Corporate Rate' },
  { id: 3, name: 'Special Event Rate' }
];

  selectVendorRates = [{ name: 'Vendor Standard' }, { name: 'Vendor Premium' }];

  dutyTypes = [{ name: 'Local' }, { name: 'Outstation' }];

  dropAt = [{ name: 'kolkata' }, { name: 'Haldia' }];

  // AutoComplete
  filteredCities: any[] = [];

  init() {
    this.bookingFrom = this.fb.group({
      id: [0],
      branch_id: [null, Validators.required],
      EntryDate: [getCurrentDate(), Validators.required],
      EntryTime: [getCurrentTime(), Validators.required],
      RentalDate: [''],
      SlipNo: ['NEW'],
      FromCityID: [''],
      ReportingDatetime: [getCurrentTime(), Validators.required],
      ToCityID: [''],
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

    this.fullBookingFrom = this.fb.group({
      bookingStatus: [''],
      Calon: [''],
      minHour: [''],
      minKm: [''],
      EntryTime: [''],
      id: [''],
      EntryDate: [''],
      branch_id: [''],
      SlipNo: [''],
      RentalDate: [''],
      ReportingDatetime: [''],
      CarType: [''],
      CarTypeSend: [''],
      Party: [null, Validators.required],
      party_name: [''],
      vendor_id: [''],
      VendorContact: [''],
      vendor_name: [''],
      CarNo: [null, Validators.required],
      DriverName: [''],
      DriverContact: ['9966525250'],
      Project: [''],
      DutyType: ['1'],
      FromCityID: ['1'],
      ToCityID: ['1'],
      BookedBy: ['SURESH BAJAJ'],
      ContactNo: ['9051471725'],
      PartyRateType: [''],
      PartyRate: ['29'],
      GarageOutDate: [''],
      GarageOutKm: [''],
      ReportDate: [''],
      ReportKm: [''],
      ReleasingDate: [''],
      ReleaseKm: [''],
      GarageInDate: [''],
      GarageInKm: [''],
      totalhrsvalue: ['0.00'],
      totalkmvalue: ['0'],
      ExtraHrs: [''],
      ExtraHrsRate: [''],
      ExtraHrsAmount: [''],
      ExtraKM: [''],
      ExtraKMRate: [''],
      ExtraKMAmount: [''],
      KMRate: ['17.5'],
      Hrs_km: ['17'],
      hrs_hrs: ['0'],
      HigherRate: ['N'],
      HourRate: ['170'],
      Price: ['0'],
      Advance: ['0.00'],
      TotalAmt: ['0'],
      TotalOtherCharge: ['0'],
      NetAmt: [''],
      VendorRateType: [''],
      VendorRate: [null, Validators.required],
      VendorGarageOutDate: [''],
      VendorGarageOutKm: ['0'],
      VendorReportDate: [''],
      VendorReportKm: ['0'],
      VendorReleasingDate: [''],
      VendorReleaseKm: ['0'],
      VendorGarageInDate: [''],
      VendorGarageInKm: ['0'],
      Vendortotalhrsvalue: ['0.00'],
      Vendortotalkmvalue: ['0'],
      VendorExtraHrs: [''],
      VendorExtraHrsRate: [''],
      VendorExtraHrsAmount: [''],
      VendorExtraKM: [''],
      VendorExtraKMRate: [''],
      VendorExtraKMAmount: ['0.00'],
      VendorKMRate: ['14.00'],
      VendorHrs_km: ['0'],
      Vendorhrs_hrs: ['0'],
      VendorHigherRate: [''],
      VendorHourRate: ['0'],
      VendorPrice: ['0'],
      VendorTotalAmt: ['0'],
      VendorTotalOtherCharge: ['0'],
      VendorNetAmt: ['0'],
      LGustName: [''],
      LContactNo: [''],
      LContactNo2: [''],
      LAddress: [''],
      LAddressLat: [''],
      LAddressLng: [''],
      LDropAddress: [''],
      LDropAddressLat: [''],
      LDropAddressLng: [''],
      LRemarks: [''],
      lid: [''],
      discount_amount: [''],
      ReportAt: [''],
      Email: [''],
      Flight_train_No: [''],
      DropAt: [''],
      BookingMode: [''],
      BookedEmail: [''],
      ReleaseAt: [''],
      BillingMode: [''],
      attachment: [''],
      isCash: ['0'],
      item_image: [''],
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
    console.log(this.filteredCarTypes)
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
  PartyName: any[] = [];
  filterPartyName(event: any) {
    if (!this.PartyName) return;
    const query = event.query.toLowerCase();
    this.PartyName = this.PartyName.filter((party) =>
      party.PartyName.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isFullBooking = params['isFullBooking'] === 'true';
    });

    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          rt = true;
        } else if (msg.for === 'getAllCityDropdown') {
          this.cities = msg.data;
          console.log(this.cities)
          rt = true;
        } else if (msg.for === 'getAllBranchDropdown') {
          this.branches = msg.data;
          rt = true;
        } else if (msg.for === 'getAllParty') {
          this.PartyName = msg.data;
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
    this.getAllPraty();
    this.init();
  }

  searchVendors(event: any) {
    const query = event.query.toLowerCase();
    this.filteredVendors = [{ name: 'Vendor 1' }, { name: 'Vendor 2' }].filter(
      (vendor) => vendor.name.toLowerCase().includes(query)
    );
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

  calculateVendorTotals() {
    const startKM = this.vendorBooking.vendorOutKM || 0;
    const endKM = this.vendorBooking.vendorInKM || 0;
    this.totalVendorKM = endKM - startKM;

    if (this.vendorBooking.vendorOut && this.vendorBooking.vendorIn) {
      const start = new Date(this.vendorBooking.vendorOut).getTime();
      const end = new Date(this.vendorBooking.vendorIn).getTime();
      this.totalVendorHours = Math.max(
        0,
        Math.round((end - start) / (1000 * 60 * 60))
      );
    }

    const kmCharge = this.totalVendorKM * (this.vendorBooking.kmRate || 0);
    const hourCharge =
      this.totalVendorHours * (this.vendorBooking.hourRate || 0);
    const extraCharge =
      (this.vendorBooking.extraHourAmount || 0) +
      (this.vendorBooking.extraKmAmount || 0);

    this.vendorBooking.netAmount =
      kmCharge + hourCharge + (this.vendorBooking.price || 0);

    this.vendorBooking.otherCharges = this.vendorCharges.reduce(
      (sum, charge) => sum + (charge.amount || 0),
      0
    );

    this.vendorBooking.totalAmount =
      this.vendorBooking.netAmount +
      this.vendorBooking.otherCharges +
      extraCharge -
      (this.vendorBooking.advance || 0);
  }

  addVendorCharge() {
    this.vendorCharges.push({ name: '', amount: 0 });
  }

  removeVendorCharge(index: number) {
    this.vendorCharges.splice(index, 1);
    this.calculateVendorTotals();
  }

  onVendorFileSelected(event: any, index: number) {
    // Optional: Handle file upload for vendor charges
  }

  onFileSelectedGuest(event: any) {
    // Handle file selection logic
  }

  // API CALLS
  getCarTypeName() {
    console.log('getCarTypeName');
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

  getAllPraty() {
    this.partyMasterService.GatAllParty({});
  }

  // Change Functions
  changePartyRateType() {
    // console.log('city_id : ', this.booking.FromCityID.Id);
    // console.log('party_id : ', this.booking.Party);
    // console.log('car_type_id : ', this.booking.CarType.id);
    // console.log('duty_type : ', this.booking.PartyRateType);
  }

  // OnSelect Functions
  onBranchSelect(branch: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('branch_id').setValue(branch.value.Id);
      console.log(branch);
    }
  }

  onCitySelect(city: any) {
    if (this.bookingFrom) {
      this.bookingFrom.get('FromCityID').setValue(city.value.Id);
    }
    console.log(city);
  }

  onToCitySelect(city: any){
     if (this.bookingFrom) {
      this.bookingFrom.get('ToCityID').setValue(city.value.Id);
    }
    console.log(city);
  }


  onPartyNameSelect(party: any){
     if (this.bookingFrom) {
      this.bookingFrom.get('').setValue(party.Id);
    }
    console.log(party);
  }


  onCarTypeSelect(cartype: any) {
  if (this.bookingFrom) {
    this.bookingFrom.get('CarType').setValue(cartype);
  }
}

onToggleBooking(event: any) {
  this.isFullBooking = !this.isFullBooking;
}



  submitBooking() {
    if (this.bookingFrom.valid) {
      console.log('Submitted Form Values:', this.bookingFrom.value);
    } else {
      // Show validation errors
      console.warn('Form is invalid');
      this.bookingFrom.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }

  submitFullBooking() {
    if (this.fullBookingFrom.valid) {
      console.log('Submitted Form Values:', this.fullBookingFrom.value);
    } else {
      // Show validation errors
      console.warn('Form is invalid');
      this.fullBookingFrom.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }
}
