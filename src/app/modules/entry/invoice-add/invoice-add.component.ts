import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
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
import { globalRequestHandler } from '../../../utils/global';
import { carTypeMasterService } from '../../../services/carTypeMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { commonService } from '../../../services/comonApi.service';
import { AutoComplete } from 'primeng/autocomplete';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-invoice-add',
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
  templateUrl: './invoice-add.component.html',
  styleUrl: './invoice-add.component.css',
})
export class InvoiceAddComponent {
  constructor(
    private fb: FormBuilder,
    private carTypeMaster: carTypeMasterService,
    private router: Router,
    private messageService: MessageService,
    private commonApiService: commonService,
    private cdr: ChangeDetectorRef,
    private _invoice: InvoiceService
  ) {}

  taxType = 'cgst';
  rcm = 'no';
  billDate = new Date();
  carTypes?: any[];

  searchText: any;
  selectedShow: any;
  show = [10, 50, 100, 500, 1000, 2000];
  displayDuty = false;

  invoiceForm!: FormGroup;

  charges = [
    { name: 'Fuel Surcharge', amount: 200 },
    { name: 'Driver Allowance', amount: 100 },
  ];

  companies = [{ label: 'ABC Ltd', value: 1 }];
  branches: any[] = [];
  parties = [{ label: 'XYZ Pvt Ltd', value: 501 }];
  cities: any[] = [];

  dutyTableData: any[] = [];
  tableLoading = false;
  totalRecords = 0;

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

      // id
      // City
      // duty_type
      // branch_id
      // company_id
      // branch
      // party_id
      // city_id
      // BillNo
      // BillDate
      // taxtype
      // rcm
      // GrossAmount
      // OtherCharges
      // Discount
      // CGSTPer
      // CGST
      // SGSTPer
      // SGST
      // OtherCharges2
      // RoundOff
      // NetAmount
      // Advance
    },
    // Add more invoice entries here...
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
    });
  }

  carTypeSearch: any;

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
          console.log(this.branches);
          rt = true;
        } else if (msg.for === 'getAllPartyDropdown') {
          this.PartyName = msg.data;
          rt = true;
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });

    this._invoice.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);

      if (msg.for) {
        if (msg.for === 'dutyTableData') {
          this.dutyTableData = msg.data || [];
          this.totalRecords = msg.total || 0;
          this.tableLoading = false;
          console.log('Duty table loaded:', this.dutyTableData);
          this.cdr.detectChanges();
          rt = true;
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
    this.init();
    this.loadDutyTable();

    // Check for edit data
    const editData = history.state?.editInvoice;

    if (editData) {
      this.isEditMode = true;
      this.patchInvoice(editData);
    }
  }

  loadDutyTable() {
    console.log('Loading duty table...');
    this.tableLoading = true;

    const payload = {
      page: 1,
      pageSize: 10,
      from_date: '2025-07-01',
      to_date: '2025-07-30',
      Party: 'INTAS PHARMA LIMITED',
      Project: 'ProjectX',
      City: 'Mumbai',
    };

    this._invoice.getBookingList(payload);
  }

  ngOnDestroy(): void {
    this._invoice.unregisterPageHandler();
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
    console.log(this.filteredCities);
  }

  filteredBranches: any[] = [];

  filterBranches(event: any) {
    if (!this.branches) return;
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter((branch) =>
      branch.branch_name.toLowerCase().includes(query)
    );
  }

  // API CALLS

  getAllCity() {
    this.commonApiService.GatAllCityDropDown({});
  }

  getAllBranches() {
    this.commonApiService.GatAllBranchDropDown({});
  }

  getAllParty() {
    this.commonApiService.gateAllPartyNameDropdown();
  }



  // OnSelect Functions
  onBranchSelect(branch: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('branch_id')?.setValue(branch.value.Id);
      console.log(branch);
    }
  }

  onCitySelect(city: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('city_id')?.setValue(city.value.Id);
    }
    console.log(city);
  }

  onPartyNameSelect(party: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('party_id')?.setValue(party.value.id);
    }
    console.log(party);
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
}
