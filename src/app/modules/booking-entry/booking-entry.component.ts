import { carTypeMasterService } from './../../services/carTypeMaster.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { ToggleButton } from 'primeng/togglebutton';
import { ActivatedRoute, Router } from '@angular/router';
import { globalRequestHandler } from '../../utils/global';
import { MessageService } from 'primeng/api';
import { commonService } from '../../services/comonApi.service';
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
    private commonApiService: commonService
  ) { }
  totalHours = 0;
  totalKM = 0;
  filteredParties: any[] = [];
  filteredVendors: any[] = [];
  availableRates: any[] | undefined;
  charges: any[] = [];
  vendorCharges: { name: string; amount: number }[] = [];
  totalVendorHours = 0;
  totalVendorKM = 0;


  booking: any = {
    // Existing extras
    fullBooking: false,
    slipNo: 'NEW',
    id: 0,

    // Real fields with updated names and matching mappings
    EntryDate: '',
    EntryTime: '',
    RentalDate: new Date(),
    ReportingDatetime: '',
    DutyType: '',
    Party: '',
    ReportAt: '',
    Email: '',
    Flight_train_No: '',
    Project: '',
    CarType: '',
    DropAt: '',
    BookingMode: '',
    BookedBy: '',
    FromCityID: '',
    ToCityID: '',
    ContactNo: '',
    postJsonData: null,
    PartyRateType: '',
    PartyRate: null,
    Price: null,
    KMRate: null,
    HourRate: null,
    BookedEmail: '',
    branch_id: '',
    isCash: 0,
    Advance: 0,

    // Existing extras retained as requested
    branch: '',
    reportingTime: '',
    carTypeRequest: '',
    carTypeSend: '',
    carNo: '',
    driver: '',
    fromCity: '',
    toCity: '',
    vendor: '',
    travelMode: '',

    selectRate: null,
    garageOut: null,
    garageOutKM: null,
    reportDate: null,
    reportKM: null,
    releasingDate: null,
    releasingKM: null,
    garageInDate: null,
    garageInKM: null,

    cash: false,
    netAmount: null,
    otherCharges: null,
    totalAmount: null,
    extraHourRate: null,
    extraHour: null,
    extraKm: null,
    extraHourAmount: null,
    extraKmRate: null,
    extraKmAmount: null,

    // Optional guest section if used
    guests: []
  };


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


  branches = [{ name: 'NEW MARKET' }, { name: 'NEW DELHI-KAROL BAGH' }, { name: 'MUMBAI - ANDHERI WEST' }];

  cities?: any[];

  carTypes?: any[];
  carTypeSearch = '';

  partyRateTypes = [{ name: 'Hourly' }, { name: 'KM Based' }];

  vendorRateTypes = [{ name: 'Hourly' }, { name: 'KM Based' }];

  selectRates = [{ name: 'Standard' }, { name: 'Premium' }];

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



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.booking.fullBooking = params['isFullBooking'] === 'true';
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
          console.log(this.cities);
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
  }


  searchParties(event: any) {
    const query = event.query.toLowerCase();
    this.filteredParties = [{ name: 'ABC Corp' }, { name: 'XYZ Ltd' }].filter(
      (party) => party.name.toLowerCase().includes(query)
    );
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
}
