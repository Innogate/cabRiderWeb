import { HelperService } from './../../../../services/helper.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../services/invoice.service';
import { globalRequestHandler } from '../../../../utils/global';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { InvoiceEyesShowComponent } from '../../../../components/invoice-eyes-show/invoice-eyes-show.component';
import { userMasterService } from '../../../../services/userMaster.service';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-monthly-invoice-list',
  imports: [
    InvoiceEyesShowComponent,
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
  ],
  templateUrl: './monthly-invoice-list.component.html',
  styleUrl: './monthly-invoice-list.component.css',
})
export class MonthlyInvoiceListComponent implements OnInit {
  invoices: any[] = [];
  companies: any[] = [];
  filteredCompanies: any[] = [];
  selectedCompany: any = null;
  searchText: string = '';
  selectedShow: number | null = 10;
  show = [10, 25, 50, 100, 200, 400, 500, 1000, 2000];

  dataCount: number = 10;
  tableLading: boolean = true;
  totalRecords: number = 0;
  isLazyLoad: boolean = false;
  pageNo: number = 1;

  branches = ['Branch X', 'Branch Y'];
  parties = ['Party 1', 'Party 2'];
  cities = ['City A', 'City B'];

  taxType = 'cgst';
  rcm = 'no';
  billDate = new Date();

  displayDialog = false;

  constructor(
    private _invoice: InvoiceService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private HelperService: HelperService
  ) {}

  ngOnInit(): void {
    this.HelperService.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for === 'minvoice.getMonthlyInvoiceList') {
        this.invoices = Array.isArray(msg.data)
          ? msg.data
          : msg.data?.data || [];
        console.log('Invoices loaded:', this.invoices);

        this.totalRecords = msg.total ?? this.invoices.length;
        this.isLazyLoad = true;
        this.tableLading = false;
        this.cdr.detectChanges();
      } else if (msg.for === 'companyDropdown') {
        this.companies = msg.data;
        rt = true;
      }

      this.tableLading = false;
      return rt;
    });

    this.getInvoices();
    this.getAllCompany();
  }

  loadData($event: any) {
    if (!this.isLazyLoad) return;
    if ($event.first !== undefined) {
      this.pageNo = $event.first / $event.rows + 1;
      this.dataCount = $event.rows; // ✅ keep rows in sync
    }
    this.getInvoices();
  }

  getInvoices() {
    this.tableLading = true;
    const payload = {
      for_company_id: this.selectedCompany ?? 0,
      search: this.searchText || '',
      current_page: this.pageNo,
      page_size: this.dataCount,
    };

    this.HelperService.getMonthlyInvoiceList(payload);
  }

  searchInvoices() {
    this.pageNo = 1;
    this.getInvoices();
  }

  resetFilters() {
    this.searchText = '';
    this.selectedCompany = [];
    this.pageNo = 1;
    this.dataCount = 10;
    this.getInvoices();
  }

  goToAdd() {
    this.router.navigate(['/monthly-invoice-create']);
  }

  showInvoiceDetails = false;
  selectedInvoice: any = null;

  openInvoiceDetails(invoice: any) {
    this.selectedInvoice = { ...invoice }; // ensure new reference
    this.showInvoiceDetails = true;
  }

  editInvoice(invoice: any) {
    this.router.navigate(['/monthly-invoice-create'], {
      queryParams: { editInvoice:  JSON.stringify(invoice) },
    });
  }

  getAllCompany() {
    this.HelperService.getCompanyDropdown();
  }

  filterCompany(event: any) {
    if (!this.companies) return;
    const query = event.query.toLowerCase();
    this.filteredCompanies = this.companies.filter((company) =>
      company.Name.toLowerCase().includes(query)
    );
  }

  // payment recived
  showDialog = false;

  rows = 10;
  globalFilter = '';
  entryOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
  ];

  payments = [
    {
      voucherNo: 'V123',
      amount: 5000,
      paymentReceived: 4500,
      tdsAmount: 200,
      discountAmount: 300,
    },
  ];

  openDialog() {
    this.showDialog = true;
  }
}
