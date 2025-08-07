import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { globalRequestHandler } from '../../utils/global';
import { carTypeMasterService } from '../../services/carTypeMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { commonService } from '../../services/comonApi.service';
import { AutoComplete } from 'primeng/autocomplete';
import { InvoiceService } from '../../services/invoice.service';
import { MinvoiceService } from '../../services/minvoice.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-mbilling',
  imports: [
    FormsModule,
    RadioButtonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    RippleModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    CalendarModule,
    BadgeModule,
  ],
  templateUrl: './mbilling.component.html',
  styleUrl: './mbilling.component.css',
})
export class MbillingComponent {
  constructor(
    private fb: FormBuilder,
    private carTypeMaster: carTypeMasterService,
    private router: Router,
    private messageService: MessageService,
    private commonApiService: commonService,
    private cdr: ChangeDetectorRef,
    private _invoice: InvoiceService,
    private _minvoice: MinvoiceService,
    private _helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          this.mapCarAndDutyTypesToDutyData();
          console.log('cartype', this.carTypes);
          rt = true;
        } else if (msg.for === 'getAllCityDropdown') {
          this.cities = msg.data;
          const city = this.cities.find((c: any) => c.Id == 1);
          if (city) {
            console.log(city);
          } else {
            console.log('no data foundcity');
          }
          rt = true;
        } else if (msg.for === 'branchDropdown') {
          this.branches = msg.data;
          console.log('branches :', this.branches);
          rt = true;
        } else if (msg.for === 'partyDropdown') {
          this.PartyName = msg.data;
          console.log('party:', msg.data);
          const party = this.PartyName.find((c: any) => c.id === 1398);
          if (party) {
            console.log(party);
          } else {
            console.log('no data foundparty');
          }
          rt = true;
        } else if (msg.for === 'companyDropdown') {
          this.companies = msg.data;
          console.log('companies', this.companies);
          const company = this.companies.find((c: any) => c.Id == 81);
          if (company) {
            console.log(company);
          } else {
            console.log('no data found');
          }
          rt = true;
        } else if (msg.for === 'minvoice.getMonthlyBookingList') {
          this.dutyTableData = msg.data || [];
          this.totalRecords = msg.total || 0;
          this.mapCarAndDutyTypesToDutyData();
          console.log('dutytable data:', this.dutyTableData);
          this.tableLoading = false;
          this.cdr.detectChanges();
          rt = true;
        } else if (msg.for === 'minvoice.getMonthlySetupCode') {
          this.monthlySetupData = msg.data;
          console.log('setupdata', this.monthlySetupData);
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });
    this.getAllMonthlySetupCode();
  }

  @Input() selectedDuties: any[] = [];
  @Input() mainDutyList: any[] = [];
  @Input() invoiceForm!: FormGroup;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mainDutyList']) {
      console.log('mainDutyList updated:', this.mainDutyList);
    }
    if (changes['selectedDuties']) {
      console.log('selectedDuties updated:', this.selectedDuties);
    }
  }

  searchText: any;
  selectedShow: any;
  show = [10, 50, 100, 500, 1000, 2000];
  displayDuty = false;

  dutyTypes = [
    { label: 'DISPOSAL', value: '1' },
    { label: 'OUTSTATION', value: '2' },
    { label: 'PICKUP', value: '3' },
    { label: 'DROP', value: '4' },
  ];

  companies: any[] = [];
  branches: any[] = [];
  parties: any[] = [];
  cities: any[] = [];
  carTypes: any[] = [];
  monthlySetupData: any[] = [];

  dutyTableData: any[] = [];
  tableLoading = false;
  totalRecords = 0;
  totalSelectedDays: number = 0;
  totalSelectedKm: number = 0;
  totalCalculatedAmount: number = 0;
  totalTimeText: string = '';
  extraHour: number = 0;
  totalExtraHour: number = 0;
  totalextraKmRate: number = 0;
  totalextraHourAmount: number = 0;
  salary: number = 0;
  totalextraHourRate: number = 0;

  private mapCarAndDutyTypesToDutyData() {
    if (!this.dutyTableData?.length) return;

    this.dutyTableData.forEach((duty: any) => {
      //  Car Type Mapping
      const carType = this.carTypes.find((c: any) => c.id == duty.CarType);
      duty.CarTypeName = carType ? carType.car_type : '';

      //  Duty Type Mapping
      const dutyType = this.dutyTypes.find(
        (d: any) => d.value == duty.DutyType
      );
      duty.DutyTypeName = dutyType ? dutyType.label : '';

      //  Date-Time Handling
      if (duty.GarageOutDate) {
        const out = new Date(duty.GarageOutDate);
        duty.fromDate = out.toISOString().split('T')[0];
        duty.fromTime = out.toTimeString().slice(0, 5);
      }

      if (duty.GarageInDate) {
        const inDate = new Date(duty.GarageInDate);
        duty.toDate = inDate.toISOString().split('T')[0];
        duty.toTime = inDate.toTimeString().slice(0, 5);
      }
    });

    this.cdr.detectChanges();
  }

  checkAndLoadDutyTable() {
    const party_id = Number(this.invoiceForm.get('party_id')?.value);
    const branch_id = Number(this.invoiceForm.get('branch_id')?.value);
    const city_id = Number(this.invoiceForm.get('city_id')?.value);
    const company_id = Number(this.invoiceForm.get('company_id')?.value);

    console.log('Selected Values:', {
      party_id,
      branch_id,
      city_id,
      company_id,
    });

    // Call only when all values are valid numbers and not NaN
    if (
      !isNaN(party_id) &&
      !isNaN(branch_id) &&
      !isNaN(city_id) &&
      !isNaN(company_id)
    ) {
      this.loadDutyTable(party_id, branch_id, city_id, company_id);
    }
  }

  loadDutyTable(
    partyId: number,
    branchId: number,
    cityId: number,
    companyId: number
  ) {
    if (!partyId || !branchId || !cityId || !companyId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Selection',
        detail: 'Please select Party, Branch, and City.',
      });
      return;
    }

    const payload = {
      party_id: partyId,
      branch_id: branchId,
      from_city_id: cityId,
      company_id: companyId,
    };

    console.log('Duty Table Payload:', payload);

    this.tableLoading = true;
    this._minvoice.getMonthlyBookingList(payload);
  }

  isEditMode: boolean = false;

  selectedBranchModel: any = null;
  selectedPartyModel: any = null;
  selectedCityModel: any = null;

  // AutoComplete
  PartyName: any[] = []; // original full list
  filteredPartyName: any[] = []; // used by the autocomplete
  filteredCities: any[] = [];
  companyList: any[] = [];
  filteredCompanies: any[] = [];

  filteredCodes: any[] = [];
  selectedCode: any[] = [];
  selectedCompany: any[] = [];

  filterCodes(event: any) {
    const query = event.query?.toLowerCase() || '';
    if (!this.monthlySetupData || !Array.isArray(this.monthlySetupData)) {
      this.filteredCodes = [];
      return;
    }
    this.filteredCodes = this.monthlySetupData.filter((codeObj) =>
      codeObj.DutyNo?.toLowerCase().includes(query)
    );
  }

  // API CALLS

  getAllMonthlySetupCode() {
    this.commonApiService.getMonthlySetupCode({});
  }

  //ADD DUTY

  // AFTER ADD DUTY UI

  // Column 1
  fixedAmount: any;
  extraHours: any;
  extrakm: any;
  exceptDayHrs: any;
  extraDaykm: any;
  fuelAmount: any;
  Sgst: any;

  // Column 2
  numDays: any;
  rate1: any;
  rate2: any;
  rate3: any;
  rate4: any;
  mobileAmount: any;
  Cgst: any;

  // Column 3
  Amount: any;
  extaHAmount: any;
  billTotal2: any;
  amount3: any;
  amount2: any;
  desc2: string = '';
  igst: any;
  isParkingTaxApplied: boolean = false;

  // Column 4
  billTotal: any;
  advance: any;
  serviceTax: any;
  eduCess: any;
  sbCess: any;
  roundOff: any;
  amountPayable: any;

  // Extra
  desc: string = '';

  calculateTotals(selected: any[]) {
    const setupCode = this.invoiceForm.get('SetupCode')?.value;
    // console.log('setupcode:', setupCode);

    if (!setupCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Setup Code',
        detail: 'Please select Duty Setup Code before calculating.',
      });
      return;
    }

    let totalDays = 0;
    let totalAmount = 0;
    let totalMinutes = 0;
    let groseAmount = 0;
    let extraHourRate = 0;
    let extraKmRate = 0;
    this.extraHour = 0; // Reset
    let totalKm = 0; // ✅ New variable to store total kilometers

    const setup = this.monthlySetupData?.find((s: any) => s.id === setupCode);
    // console.log('setup', setup);

    if (!setup) {
      this.messageService.add({
        severity: 'error',
        summary: 'Setup Code Not Found',
        detail: 'Selected Setup Code not found in Monthly Setup Data.',
      });
      return;
    }

    const seenDateRanges = new Set<string>(); // Track already processed date pairs

    selected.forEach((item: any) => {
      const fromDate = new Date(item.fromDate);
      const toDate = new Date(item.toDate);

      //  Day calculation
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        const dateKey = `${fromDate.toDateString()}_${toDate.toDateString()}`;

        if (!seenDateRanges.has(dateKey)) {
          seenDateRanges.add(dateKey); // Mark as seen

          const diffTime = toDate.getTime() - fromDate.getTime();
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

          totalDays += days;

          const dutyAmt = setup?.DutyAmt ?? 0;
          const amount = Number(((dutyAmt / 30) * days).toFixed(2));
          totalAmount += amount;
          groseAmount = dutyAmt;

          const extraDayHrsRate = setup?.OTRate ?? 0;
          extraHourRate = extraDayHrsRate;

          const extraKMRate = setup?.ExtraDayKMRate ?? 0;
          extraKmRate = extraKMRate;

          const km = Number(item.TotalKm) || 0;
          totalKm += km;
        } else {
          // Duplicate date, don't add days or amount
          console.log(`Duplicate date found: ${dateKey}, skipping day count`);
        }
      }

      //  Time calculation
      if (item.fromTime && item.toTime) {
        const [fromHours, fromMinutes] = item.fromTime.split(':').map(Number);
        const [toHours, toMinutes] = item.toTime.split(':').map(Number);

        const start = new Date();
        const end = new Date();

        start.setHours(fromHours, fromMinutes, 0, 0);
        end.setHours(toHours, toMinutes, 0, 0);

        if (end < start) {
          end.setDate(end.getDate() + 1); // Overnight
        }

        const diff = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
        totalMinutes += diff;
      }
    });

    // 📊 Final calculations
    const totalHoursDecimal = totalMinutes / 60;
    this.totalTimeText = `${totalHoursDecimal.toFixed(2)} hrs`;
    console.log('tabletime:', this.totalTimeText);

    // 🕒 Time Check using FromTime and ToTime
    if (setup?.FromTime && setup?.ToTime) {
      const fromTime = new Date(setup.FromTime);
      const toTime = new Date(setup.ToTime);
      console.log(fromTime, toTime);

      if (isNaN(fromTime.getTime()) || isNaN(toTime.getTime())) {
        console.warn('Invalid time format');
        return;
      }

      const fromDate = new Date();
      const toDate = new Date();

      fromDate.setHours(fromTime.getHours(), fromTime.getMinutes(), 0, 0);
      toDate.setHours(toTime.getHours(), toTime.getMinutes(), 0, 0);
      console.log(' Converted Grg Times →', fromDate, toDate);

      // Handle overnight shift (e.g. 8 PM to 6 AM next day)
      if (toDate < fromDate) {
        toDate.setDate(toDate.getDate() + 1);
      }

      const diffMs = toDate.getTime() - fromDate.getTime();
      const totalhrs = diffMs / (1000 * 60 * 60); // in hours
      console.log(' Total hours:', totalhrs);

      const totalHoursDecimal = this.totalTimeText
        ? parseFloat(this.totalTimeText)
        : 0;

      if (totalHoursDecimal > totalhrs) {
        this.extraHour = Number((totalHoursDecimal - totalhrs).toFixed(2));
      }
    }

    //  Set to UI-bound variables
    this.totalSelectedDays = totalDays;
    this.totalCalculatedAmount = totalAmount;
    this.salary = groseAmount;
    this.totalextraHourRate = extraHourRate;
    this.totalextraKmRate = extraKmRate;
    this.totalExtraHour = this.extraHour;
    this.totalSelectedKm = totalKm; //  Store for use elsewhere

    console.log('Total selected kilometers:', totalKm);
    console.log(' Total Time:', this.totalTimeText);
    console.log(' Total Days:', totalDays);
    console.log(' Total Amount:', totalAmount);
    console.log(' Extra Hour:', this.extraHour);
  }

  calculateBillAndLog() {
    this.calculateTotals(this.mainDutyList);

    // Auto-fill some fields with example values (for demo/testing)
    this.fixedAmount = this.salary;
    this.extraHours = this.totalExtraHour;
    this.extrakm = this.totalSelectedKm;
    this.numDays = this.totalSelectedDays;
    this.Amount = this.totalCalculatedAmount;

    this.rate1 = this.totalextraHourRate;
    this.extaHAmount = this.totalextraHourRate * this.totalExtraHour;

    this.rate2 = this.totalextraKmRate;
    this.billTotal2 = this.extrakm * this.rate2;

    // this.rate3 = 1200;
    // this.mobileAmount = 150;
    // this.fuelAmount = 0;
    // this.billTotal = this.fixedAmount + this.fuelAmount + this.rate1;
    // this.amountPayable = this.billTotal - this.advance;

    // Optional: Update other dependent fields
    // this.amountPayableText = `₹${this.amountPayable.toFixed(2)}`;
    // this.amount2 = this.amountPayable;
    // this.desc2 = 'Sample Description';
  }

  getBillingFormData() {
    return {
      // Column 1
      fixedAmount: this.fixedAmount,
      extraHours: this.totalExtraHour,
      extrakm: this.extrakm,
      exceptDayHrs: this.exceptDayHrs,
      extraDaykm: this.extraDaykm,
      fuelAmount: this.fuelAmount,

      // Column 2
      numDays: this.numDays,
      rate1: this.rate1,
      rate2: this.rate2,
      rate3: this.rate3,
      rate4: this.rate4,
      mobileAmount: this.mobileAmount,

      // Column 3
      fixedAmount2: this.Amount,
      extaHAmount: this.extaHAmount,
      billTotal2: this.billTotal2,
      amount3: this.amount3,
      amount2: this.amount2,
      desc2: this.desc2,
      isParkingTaxApplied: this.isParkingTaxApplied,

      // Column 4
      billTotal: this.billTotal,
      advance: this.advance,
      serviceTax: this.serviceTax,
      eduCess: this.eduCess,
      sbCess: this.sbCess,
      roundOff: this.roundOff,
      amountPayable: this.amountPayable,

      // Extra
      desc: this.desc,
    };
  }

  logBillingFormValues() {
    const payload = {
      ...this.getBillingFormData(),
      id: this.mainDutyList.map((d) => d.id),
    };

    this._minvoice.createMonthlyBilling(payload);
    console.log(' Final Payload:', payload);
  }
}
