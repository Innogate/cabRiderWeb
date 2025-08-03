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
  imports: [FormsModule,
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
    BadgeModule,],
  templateUrl: './monthly-invoice-create.component.html',
  styleUrl: './monthly-invoice-create.component.css'
})
export class MonthlyInvoiceCreateComponent implements OnInit{

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

       if (msg.for === 'getAllCityDropdown') {
          this.cities = msg.data;
          const city = this.cities.find((c: any) => c.Id == 1);
            if (city) {
              console.log(city);
            }
            else{
              console.log("no data foundcity")
            }
          rt = true;

        } else if (msg.for === 'branchDropdown') {
          this.branches = msg.data;
          console.log("branches :",this.branches)
          rt = true;

        } else if (msg.for === 'partyDropdown') {
          this.PartyName = msg.data;
          console.log("party:", msg.data)
          const party = this.PartyName.find((c: any) => c.id === 1398);
            if (party) {
              console.log(party);
            }
            else{
              console.log("no data foundparty")
            }
          rt = true;
        }
         else if (msg.for === 'companyDropdown') {
          this.companies = msg.data;
          console.log("companies",this.companies)
          const company = this.companies.find((c: any) => c.Id == 81);
            if (company) {
              console.log(company);
            }
            else{
              console.log("no data found")
            }
          rt = true;
        }
         else if (msg.for === 'minvoice.getMonthlyBookingList') {
          this.dutyTableData = msg.data || [];
          this.totalRecords = msg.total || 0;
          console.log("dutytable data:",this.dutyTableData)
          this.tableLoading = false;
          this.cdr.detectChanges();
          rt = true;
        }
        else if (msg.for === 'minvoice.getMonthlySetupCode') {
          this.monthlySetupData = msg.data;
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

  invoiceForm!: FormGroup;

  charges = [
    { name: 'Fuel Surcharge', amount: 200 },
    { name: 'Driver Allowance', amount: 100 },
  ];

  companies : any[] = [];
  branches: any[] = [];
  parties : any[] = [];;
  cities: any[] = [];
  monthlySetupData: any[] = [];

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
      DutyNo:[''],
    });
  }



  checkAndLoadDutyTable() {
  const partyId = this.invoiceForm.get('party_id')?.value;
  const branchId = this.invoiceForm.get('branch_id')?.value;
  const cityId = this.invoiceForm.get('city_id')?.value;
  const companyId = this.invoiceForm.get('company_id')?.value;

  // Call only when all 3 values are present
  if (partyId && branchId && cityId && companyId) {
    this.loadDutyTable(partyId, branchId, cityId, companyId);
  }
}



 loadDutyTable(partyId: string, branchId: string, cityId: string, companyId:string) {
  if (!partyId || !branchId || !cityId || !companyId) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Missing Selection',
      detail: 'Please select Party, Branch, and City.'
    });
    return;
  }

  const payload = {
    party_id: partyId,
    brunch_id: branchId,
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
  selectedCompany : any[]=[];

  filterCodes(event: any) {
  const query = event.query?.toLowerCase() || '';
  if (!this.monthlySetupData || !Array.isArray(this.monthlySetupData)) {
    this.filteredCodes = [];
    return;
  }
  this.filteredCodes = this.monthlySetupData.filter(codeObj =>
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

  getAllCompany(){
    this._helperService.getCompanyDropdown();
  }



  // OnSelect Functions
  onBranchSelect(branch: any) {
    if (this.invoiceForm) {
      this.invoiceForm.get('branch_id')?.setValue(branch.value.Id);
      this.checkAndLoadDutyTable();

    }
    console.log(branch)
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
    console.log(company)
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

  // Avoid duplication if needed
  selected.forEach((item: any) => {
    const alreadyExists = this.mainDutyList.some(d => d.BookingID === item.BookingID);
    if (!alreadyExists) {
      this.mainDutyList.push({ ...item });
    }
  });

  // Close dialog
  this.displayDuty = false;

  // Optional: Reset selection
  this.dutyTableData.forEach((item: any) => item.selected = false);
}





  // After add duty ui and table
  months = [
  { label: 'Jan', value: 'Jan' }, { label: 'Feb', value: 'Feb' },
  { label: 'Mar', value: 'Mar' }, { label: 'Apr', value: 'Apr' },
  { label: 'May', value: 'May' }, { label: 'Jun', value: 'Jun' },
  { label: 'Jul', value: 'Jul' }, { label: 'Aug', value: 'Aug' },
  { label: 'Sep', value: 'Sep' }, { label: 'Oct', value: 'Oct' },
  { label: 'Nov', value: 'Nov' }, { label: 'Dec', value: 'Dec' },
];

selectedMonth = 'Jan';
dbillDate = new Date();
billNo = '';
fixedAmount = 54000;
extraHours = 0;
exceptDayHrs = 0;
fuelAmount = 0;
nightAmount = 0;
numDays = 0;
rate = 0;
rateAmount = 0;
mobileAmount = 0;
outstationText = '';
parking = 600;
desc = '';
billTotal = 54000;
advance = 0;
amountPayable = 54600;

entries = [
  {
    id: 1,
    outDate: '19/02/2024',
    outTime: '10:00',
    inDate: '19/02/2024',
    inTime: '20:00',
    totalTime: '10:00',
    overTime: 0,
    kmOut: 1550,
    kmIn: 1556,
    totalKm: 6,
    parking: 600,
    nightHalt: 0,
    outstation: '',
    carNo: 4533
  }
];

selectedEntries = [];

calculate() {
  this.amountPayable = this.billTotal + this.parking + this.nightAmount - this.advance;
}

}
