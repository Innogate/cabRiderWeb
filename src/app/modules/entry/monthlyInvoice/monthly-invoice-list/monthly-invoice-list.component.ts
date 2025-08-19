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
  invoices_count: number = 0;
  invoices_table_row_count: number | null = 10;
  invoices_table_count_list = [10, 25, 50, 100, 200, 400, 500, 1000, 2000];
  is_lazy_load: boolean = false;
  page_no: number = 1;

  companies: any[] = [];
  selected_company: any = null;
  search_text: string = '';
  selected_invoice: any = null;
  

  data_count: number = 10;
  table_loading: boolean = true;


  branches = ['Lodging...'];
  parties = ['Lodging...'];
  cities = ['Lodging...'];

  display_dialog = false;
  show_other_charges = false;

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

        this.invoices_count = msg.total ?? this.invoices.length;
        this.is_lazy_load = true;
        this.table_loading = false;
        this.cdr.detectChanges();
      } else if (msg.for === 'companyDropdown') {
        this.companies = msg.data;
        rt = true;
      }

      this.table_loading = false;
      return rt;
    });

    this.getInvoices();
    this.getAllCompany();
  }

  loadData($event: any) {
    if (!this.is_lazy_load) return;
    if ($event.first !== undefined) {
      this.page_no = $event.first / $event.rows + 1;
      this.data_count = $event.rows;
    }
    this.getInvoices();
  }

  getInvoices() {
    this.table_loading = true;
    const payload = {
      for_company_id: this.selected_company ?? 0,
      search: this.search_text || '',
      current_page: this.page_no,
      page_size: this.data_count,
    };

    this.HelperService.getMonthlyInvoiceList(payload);
  }

  searchInvoices() {
    this.page_no = 1;
    this.getInvoices();
  }

  resetFilters() {
    this.search_text = '';
    this.selected_company = [];
    this.page_no = 1;
    this.data_count = 10;
    this.getInvoices();
  }

  openCreateUI() {
    this.router.navigate(['/monthly-invoice-create']);
  }

  openOtherCharges(invoice: any) {
    this.selected_invoice = { ...invoice };
    this.show_other_charges = true;
  }

  editInvoice(invoice: any) {
    this.router.navigate(['/monthly-invoice-create'], {
      queryParams: { editInvoice:  JSON.stringify(invoice) },
    });
  }

  getAllCompany() {
    this.HelperService.getCompanyDropdown();
  }

  // ! payment recived
  show_dialog = false;

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
    this.show_dialog = true;
  }
}
