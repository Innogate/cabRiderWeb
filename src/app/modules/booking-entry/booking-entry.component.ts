import { partyRateMasterService } from './../../services/partyRateMaster.service';
import { carTypeMasterService } from './../../services/carTypeMaster.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { ToggleButton } from 'primeng/togglebutton';
import { ActivatedRoute, Router } from '@angular/router';
import { getCurrentDate, getCurrentTime, globalRequestHandler } from '../../utils/global';
import { MessageService } from 'primeng/api';
import { commonService } from '../../services/comonApi.service';
import { partyMasterService } from '../../services/partyMaster.service';
@Component({
  selector: 'app-booking-entry',
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    TabPanel,
    TabViewModule,
    ToggleButton,
    ReactiveFormsModule,
    FormsModule
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
  ) { }
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
    { label: 'Garage Out', dateModel: 'garageOut', kmLabel: 'Garage Out KM', kmModel: 'garageOutKM' },
    { label: 'Report Date', dateModel: 'reportDate', kmLabel: 'Report KM', kmModel: 'reportKM' },
    { label: 'Releasing Date', dateModel: 'releasingDate', kmLabel: 'Releasing KM', kmModel: 'releasingKM' },
    { label: 'Garage In Date', dateModel: 'garageInDate', kmLabel: 'Garage In KM', kmModel: 'garageInKM' }
  ];


  vendorDateFields = [
    { label: 'Vendor Out', dateModel: 'vendorOut', kmLabel: 'Vendor Out KM', kmModel: 'vendorOutKM' },
    { label: 'Report Date', dateModel: 'reportDate', kmLabel: 'Report KM', kmModel: 'reportKM' },
    { label: 'Release Date', dateModel: 'releaseDate', kmLabel: 'Release KM', kmModel: 'releaseKM' },
    { label: 'Vendor In', dateModel: 'vendorIn', kmLabel: 'Vendor In KM', kmModel: 'vendorInKM' }
  ];

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
    extraKmAmount: 0
  };



  guests = [
    { name: '', contactNo: '', additionalContactNo: '', pickupAddress: '', dropAddress: '', remarks: '' }
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
    releaseAt: ''
  };

  reportOptions = [{ label: 'Morning', value: 'Morning' }, { label: 'Evening', value: 'Evening' }];
  bookingModes = [{ label: 'Online', value: 'Online' }, { label: 'Offline', value: 'Offline' }];
  billToOptions = [{ label: 'Bill To Company', value: 'Bill To Company' }, { label: 'Bill To Guest', value: 'Bill To Guest' }];


  branches?: any[];
  cities?: any[];
  carTypes?: any[];

  carTypeSearch = '';

  partyRateTypes: any[] = [{
    label: 'Normal',
    value: 'Normal'
  },
  {
    label: 'Hrs',
    value: 'Hrs'
  },
  {
    label: 'DayKM',
    value: 'DayKM'
  },
  {
    label: 'Trn',
    value: 'Trn'
  }];

  vendorRateTypes = [{ name: 'Hourly' }, { name: 'KM Based' }];

  selectRates?: any[];

  selectVendorRates = [{ name: 'Vendor Standard' }, { name: 'Vendor Premium' }];

  dutyTypes = [{ name: 'Local' }, { name: 'Outstation' }];

  dropAt = [{ name: 'kolkata' }, { name: 'Haldia' }];

  // AutoComplete
  filteredCities: any[] = [];

  filterCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }

  filteredToCities: any[] = [];

  filterToCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredToCities = this.cities.filter(city =>
      city.CityName.toLowerCase().includes(query)
    );
  }


  filteredCarTypes: any[] = [];

  filterCarTypes(event: any) {
    if (!this.carTypes) return;
    const query = event.query.toLowerCase();
    this.filteredCarTypes = this.carTypes.filter(type =>
      type.car_type.toLowerCase().includes(query)
    );
  }

  filteredCarTypeSend: any[] = [];

  filterCarTypeSend(event: any) {
    if (!this.carTypes) return;
    const query = event.query.toLowerCase();
    this.filteredCarTypeSend = this.carTypes.filter(type =>
      type.car_type.toLowerCase().includes(query)
    );
  }

  filteredBranches: any[] = [];

  filterBranches(event: any) {
    if (!this.branches) return;
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.branch_name.toLowerCase().includes(query)
    );
  }

  // AutoComplete
  PartyName: any[] = [];
  filterPartyName(event: any) {
    if (!this.PartyName) return;
    const query = event.query.toLowerCase();
    this.PartyName = this.PartyName.filter(party =>
      party.PartyName.toLowerCase().includes(query)
    );
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isFullBooking = params['isFullBooking'] === 'true';
    });

    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === "CarTypeGate") {
          this.carTypes = msg.data;
          rt = true;
        }
        else if (msg.for === "getAllCityDropdown") {
          this.cities = msg.data;
          rt = true;
        }
        else if (msg.for === "getAllBranchDropdown") {
          this.branches = msg.data;
          rt = true;
        }
        else if (msg.for === "getAllParty") {
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
  }

  init() {
    this.bookingFrom = this.fb.group({
      id: [0],
      branch_id: [null, Validators.required],
      EntryDate: [getCurrentDate(), Validators.required],
      EntryTime: [getCurrentTime(), Validators.required],
      RentalDate: ["2025-06-30"],
      SlipNo: ["LC30062025-66"],
      FromCityID: [1],
      ReportingDatetime: ["15:01"],
      ToCityID: [1],
      DutyType: [1],
      Party: [2],
      ReportAt: ["Office"],
      Email: [""],
      Flight_train_No: [""],
      Project: [""],
      DropAt: [""],
      CarType: [25],
      BookingMode: ["SMS"],
      BookedBy: ["SURESH BAJAJ"],
      ContactNo: ["9051471725"],
      BookedEmail: [""],
      Advance: [0],
      PartyRateType: ["Normal"],
      PartyRate: [29],
      Price: [0],
      HourRate: [170],
      KMRate: [17.5],
      LGustName: this.fb.array(["AMIT SHAH"]),
      lid: this.fb.array([113097, 0]),
      LContactNo: this.fb.array(["1234567890"]),
      LContactNo2: this.fb.array([""]),
      LAddress: this.fb.array(["B.G. THAPAR HOUSE, 12TH FLOOR,ROOM NO, 1205,KOLKATA - 700001"]),
      LDropAddress: this.fb.array([""]),
      LRemarks: this.fb.array([""]),
      discount_amount: this.fb.array([""]),
      isCash: [0]
    });

    this.fullBookingFrom = this.fb.group({
      bookingStatus: ["auto"],
      Calon: ["M"],
      minHour: ["8.50"],
      minKm: ["0"],
      EntryTime: ["14:38"],
      id: ["85805"],
      EntryDate: ["14-07-2025"],
      branch_id: ["17"],
      SlipNo: ["LC06032025-56"],
      RentalDate: ["2025-03-06"],
      ReportingDatetime: ["21:00"],
      CarType: ["25"],
      CarTypeSend: ["25"],
      Party: ["2"],
      party_name: ["INTAS PHARMA LIMITED"],
      vendor_id: ["3"],
      VendorContact: ["780566895"],
      vendor_name: ["RAMESHWAR CAR RENTALS"],
      CarNo: ["WB-04-A-1221"],
      DriverName: ["RAM YADAV"],
      DriverContact: ["9966525250"],
      Project: [""],
      DutyType: ["1"],
      FromCityID: ["1"],
      ToCityID: ["1"],
      BookedBy: ["SURESH BAJAJ"],
      ContactNo: ["9051471725"],
      PartyRateType: ["Normal"],
      PartyRate: ["29"],
      GarageOutDate: ["2025-03-06T20:30"],
      GarageOutKm: ["0"],
      ReportDate: ["2025-03-06T21:00"],
      ReportKm: ["0"],
      ReleasingDate: ["2025-03-06T21:00"],
      ReleaseKm: ["0"],
      GarageInDate: ["2025-03-06T21:00"],
      GarageInKm: ["0"],
      totalhrsvalue: ["0.00"],
      totalkmvalue: ["0"],
      ExtraHrs: [""],
      ExtraHrsRate: [""],
      ExtraHrsAmount: [""],
      ExtraKM: [""],
      ExtraKMRate: [""],
      ExtraKMAmount: [""],
      KMRate: ["17.5"],
      Hrs_km: ["17"],
      hrs_hrs: ["0"],
      HigherRate: ["N"],
      HourRate: ["170"],
      Price: ["0"],
      Advance: ["0.00"],
      TotalAmt: ["1445"],
      TotalOtherCharge: ["0"],
      NetAmt: ["1445"],
      VendorRateType: ["Normal"],
      VendorRate: ["1"],
      VendorGarageOutDate: ["2025-03-06T21:00"],
      VendorGarageOutKm: ["0"],
      VendorReportDate: ["2025-03-06T21:00"],
      VendorReportKm: ["0"],
      VendorReleasingDate: ["2025-03-06T21:00"],
      VendorReleaseKm: ["0"],
      VendorGarageInDate: ["2025-03-06T21:00"],
      VendorGarageInKm: ["0"],
      Vendortotalhrsvalue: ["0.00"],
      Vendortotalkmvalue: ["0"],
      VendorExtraHrs: [""],
      VendorExtraHrsRate: [""],
      VendorExtraHrsAmount: [""],
      VendorExtraKM: [""],
      VendorExtraKMRate: [""],
      VendorExtraKMAmount: ["0.00"],
      VendorKMRate: ["14.00"],
      VendorHrs_km: ["0"],
      Vendorhrs_hrs: ["0"],
      VendorHigherRate: ["N"],
      VendorHourRate: ["140.00"],
      VendorPrice: ["0.00"],
      VendorTotalAmt: ["1120"],
      VendorTotalOtherCharge: ["0"],
      VendorNetAmt: ["1120"],
      LGustName: this.fb.array(["AMIT SHAH"]),
      LContactNo: this.fb.array(["1234567890"]),
      LContactNo2: this.fb.array([""]),
      LAddress: this.fb.array(["B.G. THAPAR HOUSE, 12TH FLOOR,ROOM NO, 1205,KOLKATA - 700001"]),
      LAddressLat: this.fb.array([""]),
      LAddressLng: this.fb.array([""]),
      LDropAddress: this.fb.array([""]),
      LDropAddressLat: this.fb.array([""]),
      LDropAddressLng: this.fb.array([""]),
      LRemarks: this.fb.array([""]),
      lid: this.fb.array(["85533"]),
      discount_amount: this.fb.array([""]),
      ReportAt: ["RAILWAY STATION"],
      Email: [""],
      Flight_train_No: [""],
      DropAt: [""],
      BookingMode: [""],
      BookedEmail: [""],
      ReleaseAt: [""],
      BillingMode: [""],
      attachment: [""],
      isCash: ["0"],
      item_image: ["undefined"]
    });
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

  saveBooking() {
    console.log('Booking Data:', this.booking);
    // console.log('Guest List:', this.guests);
    // console.log('vendor data:', this.vendorBooking);
    // Add service call to save the data here
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

  calculateTotals() {
    // Calculate Total KM
    const startKM = this.booking.garageOutKM || 0;
    const endKM = this.booking.garageInKM || 0;
    this.totalKM = endKM - startKM;

    // Calculate Total Hours
    if (this.booking.garageOut && this.booking.garageInDate) {
      const start = new Date(this.booking.garageOut).getTime();
      const end = new Date(this.booking.garageInDate).getTime();
      this.totalHours = Math.max(0, Math.round((end - start) / (1000 * 60 * 60)));
    }

    // Calculate Net Amount
    const kmCharge = this.totalKM * (this.booking.kmRate || 0);
    const hourCharge = this.totalHours * (this.booking.hourRate || 0);
    const extraCharge = (this.booking.extraHourAmount || 0) + (this.booking.extraKmAmount || 0);

    this.booking.netAmount = kmCharge + hourCharge + (this.booking.price || 0);

    // Calculate Other Charges from additional charges table
    this.booking.otherCharges = this.charges.reduce((sum, charge) => sum + (charge.amount || 0), 0);

    // Calculate Total Amount
    this.booking.totalAmount = this.booking.netAmount + this.booking.otherCharges + extraCharge - (this.booking.advance || 0);
  }


  calculateVendorTotals() {
    const startKM = this.vendorBooking.vendorOutKM || 0;
    const endKM = this.vendorBooking.vendorInKM || 0;
    this.totalVendorKM = endKM - startKM;

    if (this.vendorBooking.vendorOut && this.vendorBooking.vendorIn) {
      const start = new Date(this.vendorBooking.vendorOut).getTime();
      const end = new Date(this.vendorBooking.vendorIn).getTime();
      this.totalVendorHours = Math.max(0, Math.round((end - start) / (1000 * 60 * 60)));
    }

    const kmCharge = this.totalVendorKM * (this.vendorBooking.kmRate || 0);
    const hourCharge = this.totalVendorHours * (this.vendorBooking.hourRate || 0);
    const extraCharge = (this.vendorBooking.extraHourAmount || 0) + (this.vendorBooking.extraKmAmount || 0);

    this.vendorBooking.netAmount = kmCharge + hourCharge + (this.vendorBooking.price || 0);

    this.vendorBooking.otherCharges = this.vendorCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);

    this.vendorBooking.totalAmount = this.vendorBooking.netAmount + this.vendorBooking.otherCharges + extraCharge - (this.vendorBooking.advance || 0);
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
      'PageNo': 1,
      'PageSize': 10,
      'Search': this.carTypeSearch,
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
    if (!this.bookingFrom) return;
    this.bookingFrom.get('branch_id')?.setValue(branch.id);
  }

}
