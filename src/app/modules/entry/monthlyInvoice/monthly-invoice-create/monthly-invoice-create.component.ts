import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { globalRequestHandler } from '../../../../utils/global';
import { carTypeMasterService } from './../../../../services/carTypeMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { commonService } from '../../../../services/comonApi.service';
import { AutoComplete } from 'primeng/autocomplete';
import { InvoiceService } from '../../../../services/invoice.service';
import { MinvoiceService } from '../../../../services/minvoice.service';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-monthly-invoice-create',
  imports: [
    FormsModule,
    AutoComplete,
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
  templateUrl: './monthly-invoice-create.component.html',
  styleUrl: './monthly-invoice-create.component.css',
})
export class MonthlyInvoiceCreateComponent implements OnInit {



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
    this.commonApiService.registerPageHandler((msg) => {
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
          console.log("setupdata",this.monthlySetupData)
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });

    this.getAllCity();
    this.getAllBranches();
    this.getAllParty();
    this.getCarTypeName();
    this.getAllMonthlySetupCode();
    this.getAllCompany();
    this.init();

    // Check for edit data
    const editData = history.state?.editInvoice;
    if (editData) {
      this.isEditMode = true;
      this.patchInvoice(editData);
    }
  }

  ngOnDestroy(): void {
    this._invoice.unregisterPageHandler();
  }

  taxType = 'cgst';
  rcm = 'no';
  billDate = new Date();
  carTypes?: any[];

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

  invoiceForm!: FormGroup;

  charges = [
    { name: 'Fuel Surcharge', amount: 200 },
    { name: 'Driver Allowance', amount: 100 },
  ];

  companies: any[] = [];
  branches: any[] = [];
  parties: any[] = [];
  cities: any[] = [];
  monthlySetupData: any[] = [];

  dutyTableData: any[] = [];
  tableLoading = false;
  totalRecords = 0;
  totalSelectedDays: number = 0;
  totalCalculatedAmount: number = 0;
  totalTimeText: string = '';
  extraHour : number = 0


  invoices = [
    {
      selected: false,
      siNo: 'DguGFIJKK',
      slipNo: 'SLP001',
      dutyType: 'Local',
      carNo: 'KA-01-AB-1234',
      carType: 'Sedan',
      project: 'ABC Corp Project',
      guestName: 'John Doe',
      fromDate: '2025-07-10',
      toDate: '2025-07-10',
      fromTime: '09:00',
      toTime: '18:00',
      fromKm: 12000,
      toKm: 12200,
      totalTime: '9h',
      totalKm: 200,
      netAmount: 1500,
    },
  ];

  init() {
    this.invoiceForm = this.fb.group({
      id: [''],
      City: [''],
      duty_type: [''],
      branch_id: [''],
      company_id: [''],
      branch: [''],
      party_id: [''],
      city_id: [''],
      BillNo: ['NEW'],
      BillDate: [new Date()],
      taxtype: ['cgst'],
      rcm: ['no'],
      GrossAmount: ['0'],
      OtherCharges: ['0'],
      Discount: [''],
      CGSTPer: [''],
      CGST: ['0'],
      SGSTPer: [''],
      SGST: ['0'],
      OtherCharges2: ['0'],
      RoundOff: ['0'],
      NetAmount: ['0'],
      Advance: [''],
      DutyNo: [''],
    });
  }

  private mapCarAndDutyTypesToDutyData() {
  if (!this.dutyTableData?.length) return;

  this.dutyTableData.forEach((duty: any) => {
    //  Car Type Mapping
    const carType = this.carTypes?.find((c: any) => c.id == duty.CarType);
    duty.CarTypeName = carType ? carType.car_type : '';

    //  Duty Type Mapping
    const dutyType = this.dutyTypes.find((d: any) => d.value == duty.DutyType);
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

  patchInvoice(invoice: any) {
    const foundBranch = this.branches.find(
      (branch) => branch.branch_name == invoice.branch
    );
    const foundParty = this.PartyName.find(
      (p) => p.value === invoice.party_name
    );
    const foundCity = this.cities.find((c) => c.value === invoice.City);

    this.selectedBranchModel = foundBranch || null;
    this.selectedPartyModel = foundParty || null;
    this.selectedCityModel = foundCity || null;

    this.invoiceForm.patchValue({
      id: invoice.id || '',
      branch_id: foundBranch?.Id || null, // Use Id from matched branch
      party_id: foundParty?.value || null,
      city_id: foundCity?.value || null,
      City: invoice.City || '',
      duty_type: invoice.duty_type || '',
      company_id: invoice.company_id || '',
      branch: invoice.branch || '',
      BillNo: invoice.BillNo || 'NEW',
      BillDate: invoice.BillDate
        ? new Date(invoice.BillDate.replace(/-/g, '/'))
        : new Date(),
      taxtype: invoice.taxtype ?? 'cgst',
      rcm: invoice.rcm ?? 'yes',
      GrossAmount: invoice.GrossAmount || '0',
      OtherCharges: invoice.OtherCharges || '0',
      Discount: invoice.Discount || '',
      CGSTPer: invoice.CGSTPer || '',
      CGST: invoice.CGST || '0',
      SGSTPer: invoice.SGSTPer || '',
      SGST: invoice.SGST || '0',
      OtherCharges2: invoice.OtherCharges2 || '0',
      RoundOff: invoice.RoundOff || '0',
      NetAmount: invoice.NetAmount || '0',
      Advance: invoice.Advance || '',
    });

    console.log('Selected Branch:', this.selectedBranchModel);
    console.log('Patched Invoice:', this.invoiceForm.value);
  }

  // AutoComplete
  PartyName: any[] = []; // original full list
  filteredPartyName: any[] = []; // used by the autocomplete
  filteredCities: any[] = [];
  companyList: any[] = [];
  filteredCompanies: any[] = [];

  filterPartyName(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredPartyName = this.PartyName.filter((party) => {
      const name = party.party_name?.toLowerCase() || '';
      return name.includes(query);
    });
  }

  filterCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.CityName.toLowerCase().includes(query)
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

  filterCompany(event: any) {
    if (!this.companies) return;
    const query = event.query.toLowerCase();
    this.filteredCompanies = this.companies.filter((companies) =>
      companies.Name.toLowerCase().includes(query)
    );
  }

  // API CALLS

  getAllCity() {
    this.commonApiService.GatAllCityDropDown({});
  }

  getAllBranches() {
    this._helperService.getBranchDropdown();
  }

  getAllParty() {
    this._helperService.getPartyDropdown();
  }

  getAllMonthlySetupCode() {
    this.commonApiService.getMonthlySetupCode({});
  }

  getAllCompany() {
    this._helperService.getCompanyDropdown();
  }

  carTypeSearch = '';

  getCarTypeName() {
    // console.log('getCarTypeName');
    this.carTypeMaster.GateAllCarType({
      PageNo: 1,
      PageSize: 10,
      Search: this.carTypeSearch,
    });
  }

  // OnSelect Functions
  onBranchSelect(branch: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('branch_id')?.setValue(branch.value.id);
      this.checkAndLoadDutyTable();
    }
    console.log(branch);
  }

  onCitySelect(city: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('city_id')?.setValue(city.value.Id);
      this.checkAndLoadDutyTable();
    }
  }

  onPartyNameSelect(party: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('party_id')?.setValue(party.value.id);
      this.checkAndLoadDutyTable();
    }
  }

  onCodeSelect(codeObj: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('SetupCode')?.setValue(codeObj.value.id);
    }
    console.log('Selected Duty Setup Code:', codeObj);
  }

  onCompanySelect(company: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('company_id')?.setValue(company.value.Id);
      this.checkAndLoadDutyTable();
    }
    console.log(company);
  }

  save() {
    const formData = {
      ...this.invoiceForm.value,
      duties: this.invoices,
    };

    if (this.isEditMode) {
      console.log('📝 Updating invoice:', formData);
      // this.commonApiService.updateInvoice(formData).subscribe(...)
    } else {
      console.log('🆕 Creating new invoice:', formData);
      // this.commonApiService.createInvoice(formData).subscribe(...)
    }
  }

  searchInvoices() {
    throw new Error('Method not implemented.');
  }

  addVendorInvoice() {
    // Logic to add invoice
  }

  viewInvoice(invoice: any) {
    // Logic to view invoice
  }

  editInvoice(invoice: any) {
    // Logic to edit invoice
  }

  deleteInvoice(invoice: any) {
    // Logic to delete invoice
  }

  //ADD DUTY

  selectedDuties: any[] = []; // to store selected rows

  mainDutyList: any[] = []; // this holds the final duty list shown in main UI

  saveSelectedDuties() {
  const selected = this.dutyTableData.filter((item: any) => item.selected);

  let totalDays = 0;
  let totalAmount = 0;
  let totalMinutes = 0;

  selected.forEach((item: any) => {

    //  Find Totalday from monthlySetupData based on DutyNo
    const fromDate = new Date(item.fromDate);
    const toDate = new Date(item.toDate);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      const diffTime = toDate.getTime() - fromDate.getTime();
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      totalDays += days;

      //  Find TotalAmount from monthlySetupData based on DutyNo
      const setup = this.monthlySetupData?.find((s: any) => s.DutyNo === item.DutyNo);
      const dutyAmt = setup?.DutyAmt ?? 0;

      const amount = (dutyAmt / 30) * days;
      totalAmount += amount;
    }

    // --- Total Time Calculation in Minutes ---
    if (item.fromTime && item.toTime) {
      const [fromHours, fromMinutes] = item.fromTime.split(":").map(Number);
      const [toHours, toMinutes] = item.toTime.split(":").map(Number);

      let start = new Date();
      let end = new Date();

      start.setHours(fromHours, fromMinutes, 0, 0);
      end.setHours(toHours, toMinutes, 0, 0);

      if (end < start) {
        end.setDate(end.getDate() + 1); // Overnight
      }

      const diff = (end.getTime() - start.getTime()) / (1000 * 60);
      totalMinutes += diff;

        // Convert total minutes to decimal hours
      const totalHoursDecimal = totalMinutes / 60;
      this.totalTimeText = `${totalHoursDecimal.toFixed(2)} hrs`;

      const setup = this.monthlySetupData?.find((s: any) => s.DutyNo === item.DutyNo);
      const totalhrs = setup?.TotHrs ?? 0;

      if(this.totalTimeText > totalhrs){
       const extraHrs = (Number(this.totalTimeText) - totalhrs)
       this.extraHour = extraHrs;

      }
      console.log("Extrahour:",this.extraHour)
    }

    this.mainDutyList.push({ ...item });
  });



   this.totalSelectedDays = totalDays;
   this.totalCalculatedAmount = totalAmount;


   console.log("Total selected hour:", this.totalTimeText);
   console.log("Total selected duty days:", totalDays);
   console.log("Total selected duty amount:", totalAmount);


  this.displayDuty = false;
}


  // After add duty ui and table

  // Column 1
  fixedAmount: number = 0;
  extraHours: number = 0;
  extrakm: number = 0;
  exceptDayHrs: number = 0;
  extraDaykm: number = 0;
  fuelAmount: number = 0;

  // Column 2
  numDays: number = 0;
  rate1: number = 0;
  rate2: number = 0;
  rate3: number = 0;
  rate4: number = 0;
  mobileAmount: number = 0;

  // Column 3
  fixedAmount2: number = 0;
  amountPayableText: string = '';
  billTotal2: number = 0;
  advance2: number = 0;
  amount2: number = 0;
  desc2: string = '';
  isParkingTaxApplied: boolean = false;

  // Column 4
  billTotal: number = 0;
  advance: number = 0;
  serviceTax: number = 0;
  eduCess: number = 0;
  sbCess: number = 0;
  roundOff: number = 0;
  amountPayable: number = 0;

  // Extra
  desc: string = '';

calculateBillAndLog() {
  // Auto-fill some fields with example values (for demo/testing)
  this.fixedAmount = this.totalCalculatedAmount;
  this.extraHours = 3;
  this.extrakm = 15;
  this.fuelAmount = 500;
  this.numDays = this.totalSelectedDays;
  this.rate1 = 1000;
  this.rate2 = 800;
  this.rate3 = 1200;
  this.mobileAmount = 150;
  this.billTotal = this.fixedAmount + this.fuelAmount + this.rate1;
  this.amountPayable = this.billTotal - this.advance;

  // Optional: Update other dependent fields
  this.amountPayableText = `₹${this.amountPayable.toFixed(2)}`;
  this.billTotal2 = this.billTotal;
  this.amount2 = this.amountPayable;
  this.desc2 = 'Sample Description';

}

logBillingFormValues() {
  const billingData = {
    // Column 1
    fixedAmount: this.totalCalculatedAmount,
    extraHours: this.extraHours,
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
    fixedAmount2: this.fixedAmount2,
    amountPayableText: this.amountPayableText,
    billTotal2: this.billTotal2,
    advance2: this.advance2,
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
    desc: this.desc
  };
  console.log('📋 Billing Form Values:', billingData);
}


}
