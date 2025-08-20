import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { commonService } from '../../../../services/comonApi.service';
import { AutoComplete } from 'primeng/autocomplete';
import { InvoiceService } from '../../../../services/invoice.service';
import { MinvoiceService } from '../../../../services/minvoice.service';
import { HelperService } from '../../../../services/helper.service';
import { MbillingComponent } from '../../../../components/mbilling/mbilling.component';

@Component({
  selector: 'app-monthly-invoice-create',
  imports: [
    MbillingComponent,
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
    private _helperService: HelperService,
    private _activatedRoute: ActivatedRoute
  ) { }

  // Company Drop Down Needed
  companies: any[] = [];
  selected_company: any[] = [];
  filtered_companies: any[] = [];
  filterCompany(event: any) {
    if (!this.companies) return;
    const query = event.query.toLowerCase();
    this.filtered_companies = this.companies.filter((companies) =>
      companies.Name.toLowerCase().includes(query)
    );
  }

  // Branch Drop Down Needed
  branches: any[] = [];
  brunch_suggestions: any[] = [];
  selected_branch: any = null;
  filterBranches(event: any) {
    if (!this.branches) return;
    const query = event.query.toLowerCase();
    this.brunch_suggestions = this.branches.filter((branch) =>
      branch.branch_name.toLowerCase().includes(query)
    );
  }


  // Party Drop Down Needed
  parties: any[] = [];
  party_suggestions: any[] = [];
  selected_party: any = null;
  filterPartyName(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.party_suggestions = this.parties.filter((party) => {
      const name = party.party_name?.toLowerCase() || '';
      return name.includes(query);
    });
  }



  // City Drop Down Needed
  cities: any[] = [];
  city_suggestions: any[] = [];
  selected_city: any = null;
  filterCities(event: any) {
    if (!this.cities) return;
    const query = event.query.toLowerCase();
    this.city_suggestions = this.cities.filter((city) =>
      city.CityName.toLowerCase().includes(query)
    );
  }


  // Selected Setup Code
  setup_code_suggestions: any[] = [];
  selected_monthly_setup_code: any[] = [];
  monthly_duty_setup_codes: any[] = [];
  filterDutySetupCodes(event: any) {
    const query = event.query?.toLowerCase() || '';
    if (!this.monthly_duty_setup_codes || !Array.isArray(this.monthly_duty_setup_codes)) {
      this.city_suggestions = [];
      return;
    }
    this.city_suggestions = this.monthly_duty_setup_codes.filter((codeObj) =>
      codeObj.DutyNo?.toLowerCase().includes(query)
    );
  }

  invoiceForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    duty_type: new FormControl(''),
    branch_id: new FormControl(''),
    company_id: new FormControl(''),
    party_id: new FormControl(''),
    city_id: new FormControl(''),
    BillNo: new FormControl('NEW'),
    BillDate: new FormControl(new Date()),
    taxtype: new FormControl('cgst'),
  });




  sleetedBookingIds: any[] = [];
  taxtype: any = 'cgst';
  addDutyTableRowSize = 10;
  dutyTableDataView: any[] = [];
  invoiceData: any = {};
 async ngOnInit() {

    this.commonApiService.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          this.mapCarAndDutyTypesToDutyData();
          rt = true;
        } else if (msg.for === 'getAllCityDropdown') {
          this.cities = msg.data;
          rt = true;
        } else if (msg.for === 'branchDropdown') {
          this.branches = msg.data;
          rt = true;
        } else if (msg.for === 'partyDropdown') {
          this.parties = msg.data;
          rt = true;
        } else if (msg.for === 'companyDropdown') {
          this.companies = msg.data;
          rt = true;
        } else if (msg.for === 'minvoice.getMonthlyBookingList') {
          this.dutyTableDataView = msg.data || [];
          this.dutyTableData = this.dutyTableDataView;
          this.totalRecords = msg.total || 0;
          this.mapCarAndDutyTypesToDutyData();
          this.tableLoading = false;
          this.cdr.detectChanges();
          rt = true;
        } else if (msg.for === 'minvoice.getMonthlySetupCode') {
          this.monthly_duty_setup_codes = msg.data;
          rt = true;
        } else if (msg.for === 'getPartyById') {
          this.partyInfo = msg.data;
          rt = true;
        } else if(msg.for === 'minvoice.getBookingsListByMID'){
          rt = true;
          this.dutyTableData = msg.data;

          this.mainDutyList = msg.data;
          this.totalRecords = msg.total || 0;
          this.tableLoading = false;
          this.cdr.detectChanges();
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    })

    this.getAllCompany();
    this.getAllCity();



    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['editInvoice']) {
        this.isEditMode = true;
        try {
          const invoiceData = JSON.parse(params['editInvoice']);
          this.invoiceData = invoiceData;
          this.updatePathch(invoiceData);
        } catch (error) {
          console.error('Error parsing editInvoice data:', error);
        }
      }
    });


    this.getAllBranches();
    this.getAllParty();
    this.getCarTypeName();
    this.getAllMonthlySetupCode();

    this.init();
    this.onPageChange({ first: 0, rows: 10 });


    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // yyyy-MM-dd
    this.invoiceForm.patchValue({
      BillDate: formattedDate,
    });
  }

  ngOnDestroy(): void {
    this._invoice.unregisterPageHandler();
  }

  taxType = 'cgst';
  rcm = 'no';
  // Default bill date to today
  billDate = new Date();
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


  charges = [
    { name: 'Fuel Surcharge', amount: 200 },
    { name: 'Driver Allowance', amount: 100 },
  ];

  
  // parties: any[] = [];
  
  carTypes: any[] = [];

  dutyTableData: any[] = [];
  tableLoading = false;
  totalRecords = 0;
  totalSelectedDays: number = 0;
  totalSelectedKm: number = 0;
  totalCalculatedAmount: number = 0;
  totalTimeText: string = '';
  extraHour: number = 0;
  totalExtraHour: number = 0;

  partyInfo: any;

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

  init() {}

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
    this.tableLoading = true;
    this._minvoice.getMonthlyBookingList(payload);
  }

  isEditMode: boolean = false;


  patchInvoice(invoice: any) {
    const foundBranch = this.branches.find(
      (branch) => branch.branch_name == invoice.branch
    );
    const foundParty = this.parties.find(
      (p) => p.value === invoice.party_name
    );
    const foundCity = this.cities.find((c) => c.value === invoice.City);

    this.selected_branch = foundBranch || null;
    this.selected_party = foundParty || null;
    this.selected_city = foundCity || null;

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
    });
  }

  // AutoComplete
  
  companyList: any[] = [];

  

  // API CALLS

  getAllCity() {
    this.commonApiService.GatAllCityDropDown({});
  }

  getAllBranches() {
    if (this.invoiceForm) {
      this._helperService.getBranchDropdown(this.invoiceForm.value.company_id);
    }
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
    this._helperService.getPartyById(party.value.id);
    this._minvoice.getMonthlySetupCode({
      party_id: party.value.id,
    });
  }

  selectedMontySetupCode: any;
  onCodeSelect(codeObj: any) {
    console.log(codeObj);
    this.selectedMontySetupCode = codeObj.value;
    if (this.invoiceForm) {
      this.invoiceForm.get('SetupCode')?.setValue(codeObj.value.id);
    }
  }

  onCompanySelect(company: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('company_id')?.setValue(company.value.Id);
      this.getAllBranches();
      this.checkAndLoadDutyTable();
    }
  }

  save() {
    const formData = {
      ...this.invoiceForm.value,
      duties: this.invoices,
    };
  }

  searchInvoices() {
    console.log('Searching invoices with text:', this.searchText);
    if (this.searchText) {
      this.dutyTableData = this.dutyTableDataView.filter((invoice: any) => {
        return (
          invoice.SlipNo.toLowerCase().includes(
            this.searchText.toLowerCase() || ''
          ) ||
          invoice.DutyTypeName.toLowerCase().includes(
            this.searchText.toLowerCase() || ''
          ) ||
          invoice.CarNo.toLowerCase().includes(
            this.searchText.toLowerCase() || ''
          ) ||
          invoice.BookedBy.toLowerCase().includes(
            this.searchText.toLowerCase() || ''
          )
        );
      });
      this.totalRecords = this.dutyTableData.length;
      this.cdr.detectChanges();
    } else {
      this.dutyTableData = this.dutyTableDataView;
      this.totalRecords = this.dutyTableData.length;
      this.cdr.detectChanges();
    }
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

    // Avoid duplicates in mainDutyList using ID check
    selected.forEach((sel) => {
      const exists = this.mainDutyList.some((duty: any) => duty.id === sel.id);
      if (!exists) {
        this.mainDutyList.push({ ...sel });
      }
    });

    console.log('Selected Duties:', this.mainDutyList);
    // Mark them as disabled
    this.dutyTableData = this.dutyTableData.map((item: any) => ({
      ...item,
      disabled: selected.some((sel: any) => sel.id === item.id),
    }));
    this.displayDuty = false;
    this.sleetedBookingIds = Array.from(
      new Set([
        ...this.sleetedBookingIds,
        ...selected.map((item: any) => item.id),
      ])
    );
  }

  addDutySection() {
    // check all parameter are filled
    if (
      !(
        this.invoiceForm.get('branch_id')?.value &&
        this.invoiceForm.get('city_id')?.value &&
        this.invoiceForm.get('party_id')?.value &&
        this.invoiceForm.get('SetupCode')?.value &&
        this.invoiceForm.get('company_id')?.value
      )
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all the required fields',
      });
      return;
    }
    this.displayDuty = true;
  }

  onTaxTypeChange(event: any) {
    this.taxType = event;
    this.cdr.detectChanges();
  }

  onDutyUpdated(event: {
    dutyTableData: any[];
    mainDutyList: any[];
    sleetedBookingIds: any[];
  }) {
    this.dutyTableData = event.dutyTableData;
    this.mainDutyList = event.mainDutyList;
    this.sleetedBookingIds = event.sleetedBookingIds;
  }

  allSelected: boolean = false;

  currentPageRows: any[] = []; // only rows in current page

  // PrimeNG onPage event handler
  onPageChange(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.currentPageRows = this.dutyTableData.slice(start, end);

    // sync header checkbox for current page
    this.checkIndividual();
  }

  // Select/unselect only current page rows
  toggleAll(event: any) {
    const checked = event.target.checked;
    this.allSelected = checked;

    this.currentPageRows.forEach((row) => {
      row.selected = checked;
    });
  }

  // Update header checkbox when row selection changes
  checkIndividual() {
    this.allSelected =
      this.currentPageRows.length > 0 &&
      this.currentPageRows.every((row) => row.selected);
  }

  async updatePathch(invoice: any) {
    console.log('Updating invoice with data:', invoice);
    this.invoiceForm = this.fb.group({
      id: [invoice.id || ''],
      City: [invoice.CityName || ''],
      duty_type: [invoice.duty_type || ''],
      branch_id: [invoice.branch_id || ''],
      company_id: [invoice.company_id || ''],
      branch: [invoice.branch_id || ''],
      party_id: [invoice.party_id || ''],
      city_id: [invoice.city_id || ''],
      BillNo: [invoice.BillNo || 'Bill NO not found'],
      BillDate: [new Date(invoice.BillDate).toDateString()],
      taxtype: [invoice.taxtype == 1 ? 'cgst' : 'igst'],
      rcm: [invoice.rcm || 0],
      GrossAmount: [invoice.GrossAmount || '0'],
      OtherCharges: [invoice.OtherCharges || '0'],
      Discount: [invoice.Discount || ''],
      CGSTPer: [invoice.CGSTPer || ''],
      CGST: [invoice.CGST || '0'],
      SGSTPer: [invoice.SGSTPer || ''],
      SGST: [invoice.SGST || '0'],
      OtherCharges2: [invoice.OtherCharges2 || '0'],
      RoundOff: [invoice.RoundOff || '0'],
      NetAmount: [invoice.NetAmount || '0'],
      Advance: [invoice.Advance || ''],
      SetupCode: [invoice.SetupCode || ''],
    });

    await this.waitForFetch(() => this.companies);
    this.selected_company = this.companies.find(
      (company) => {
        return company.Id == invoice.company_id;
      }
    ).Name;
    this.getAllBranches();
    await this.waitForFetch(() => this.branches);
    this.selected_branch = this.branches.find(
      (branch) => {
        return branch.id == invoice.branch_id;
      }
    )

    this.getAllParty();
    await this.waitForFetch(() => this.parties);
    this.selected_party = this.parties.find(
      (party) => {
        return party.id == invoice.party_id;
      }
    )

    this._helperService.getPartyById(invoice.party_id);
    this._minvoice.getMonthlySetupCode({
      party_id: invoice.party_id,
    });

    await this.waitForFetch(() => this.cities);
    this.selected_city = this.cities.find(
      (city) => {
        return city.Id == invoice.city_id;
      }
    )

    await this.waitForFetch(() => this.monthly_duty_setup_codes);
    this.selected_monthly_setup_code = this.monthly_duty_setup_codes.find(
      (code) => {
        return code.id == invoice.monthly_duty_id;
      }
    )
    
    // NOW TIME TO PATCH THE BOOKING DATA
    console.log("calling booking api");
    this._minvoice.getMonthlyInvoiceListByMID({
      booking_entry_id: invoice.id
    })

    this.cdr.detectChanges();
  }

  waitForFetch<T>(getter: () => T, interval = 50): Promise<T> {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const value = getter();

        // Check if value is not undefined, null, empty string, or empty array
        if (
          value !== undefined &&
          value !== null &&
          !(typeof value === 'string' && value.trim() === '') &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          clearInterval(timer);
          resolve(value);
        }
      }, interval);
    });
  }
}

