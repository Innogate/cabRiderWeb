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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
  selectedChargeType: 'taxable' | 'nonTaxable' = 'taxable';

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


  openOtherCharges(invoice: any, type: 'taxable' | 'nonTaxable') {
    this.selected_invoice = { ...invoice };
    this.selectedChargeType = type;
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

async generatePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { height, width } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // === Header (Centered) ===
  page.drawText('Darwar Enterprise', {
    x: width / 2 - font.widthOfTextAtSize('Darwar Enterprise', 14) / 2,
    y: height - 50, size: 14, font, color: rgb(0, 0, 0),
  });
  page.drawText('7/1/1, Bijay Basu Road Kolkata 700025, West Bengal (WB-19)', {
    x: width / 2 - font.widthOfTextAtSize('7/1/1, Bijay Basu Road Kolkata 700025, West Bengal (WB-19)', 10) / 2,
    y: height - 70, size: 10, font,
  });
  page.drawText('Phone: 033-2466-4533 / 0885-8948-8499 / 09090-999-4488', {
    x: width / 2 - font.widthOfTextAtSize('Phone: 033-2466-4533 / 0885-8948-8499 / 09090-999-4488', 10) / 2,
    y: height - 85, size: 10, font,
  });
  page.drawText('Email: info@darwarenterprise.com', {
    x: width / 2 - font.widthOfTextAtSize('Email: info@darwarenterprise.com', 10) / 2,
    y: height - 100, size: 10, font,
  });

  // === TAX INVOICE Title (Centered with underline) ===
  const invoiceText = 'TAX INVOICE';
  const invoiceTextWidth = font.widthOfTextAtSize(invoiceText, 12);
  const invoiceX = width / 2 - invoiceTextWidth / 2;
  const invoiceY = height - 130;

  page.drawText(invoiceText, { x: invoiceX, y: invoiceY, size: 12, font });
  // underline
  page.drawLine({
    start: { x: invoiceX - 10, y: invoiceY - 5 },
    end: { x: invoiceX + invoiceTextWidth + 10, y: invoiceY - 5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // === Left Section ===
  page.drawText('To,', { x: 50, y: height - 170, size: 10, font });
  page.drawText('STATE BANK OF INDIA (IFB KOLKATA BRANCH)', { x: 50, y: height - 185, size: 10, font });
  page.drawText('1, Middleton Street', { x: 50, y: height - 200, size: 10, font });
  page.drawText('Kolkata : 700071', { x: 50, y: height - 215, size: 10, font });

  // === Right Section (Boxed Details) ===
  const infoBoxX = 350;
  const infoBoxY = height - 170;
  const infoBoxW = 200;
  const infoBoxH = 100;

  page.drawRectangle({
    x: infoBoxX, y: infoBoxY - infoBoxH, width: infoBoxW, height: infoBoxH,
    borderColor: rgb(0, 0, 0), borderWidth: 1,
  });

  const invoiceDetails = [
    'Tax Invoice No.: DE/584/25-26',
    'Tax Invoice Date: 05-07-25',
    'Classification: RENT-A-CAR',
    'Place of Supply: Kolkata',
    'Car Type: HONDA CITY',
    'Category: 1500 KMS/12 Hrs',
  ];

  invoiceDetails.forEach((text, i) => {
    page.drawText(text, { x: infoBoxX + 5, y: infoBoxY - 15 - i * 15, size: 9, font });
  });

  // === Box Style Table (instead of rows) ===
  const tableX = 40;
  const tableY = height - 300;
  const tableWidth = 515;
  const rowHeight = 25;

  const rows = [
    { particulars: 'Being monthly hire charges (01/06/2025 to 30/06/2025)', amount: '63000.00' },
    { particulars: 'Extra Hour(s) 100.25 X 75', amount: '7518.75' },
    { particulars: 'Extra KM 780 X 20', amount: '15600.00' },
    { particulars: 'Gross Total', amount: '2000.00' },
    { particulars: 'CGST @ 6%', amount: '300.00' },
    { particulars: 'SGST @ 6%', amount: '324.00' },
    { particulars: 'Holi days', amount: '3150.00' },
    { particulars: 'Driver Washing uniform 780 X 20', amount: '4175.25' },
    { particulars: 'Car Washing charges', amount: '500.00' },
    { particulars: 'Driver Phone Recharge', amount: '2220.00' },
    { particulars: 'Parking/Tolls/Permit Amount', amount: '5000.00' },
    { particulars: 'Night Halt Amount', amount: '2000.00' },
    { particulars: 'Night Halting Charges', amount: '300.00' },
    { particulars: 'Round OFF', amount: '2220.00' },
    { particulars: 'Net Amount (One lakh eleven thousand forty three only)', amount: '111043.00' },
    { particulars: 'GST No: 16894j979j86C6P', amount: '' },
    { particulars: 'PAN No: ABCDE1234F', amount: '' },
    { particulars: 'SAC Code: 1234', amount: '' },
  ];

  rows.forEach((row, i) => {
    const rowTop = tableY - i * rowHeight;
    // Draw box per row
    page.drawRectangle({
      x: tableX, y: rowTop - rowHeight, width: tableWidth, height: rowHeight,
      borderColor: rgb(0, 0, 0), borderWidth: 0.8,
    });

    // Text inside
    page.drawText(row.particulars, { x: tableX + 5, y: rowTop - 17, size: 9, font });
    page.drawText(row.amount, { x: tableX + tableWidth - 80, y: rowTop - 17, size: 9, font });
  });

  // === Second Page (Detail Sheet) ===
  const detailPage = pdfDoc.addPage([595.28, 841.89]);
  const dHeight = detailPage.getSize().height;

  detailPage.drawText('DETAIL SHEET', {
    x: width / 2 - font.widthOfTextAtSize('DETAIL SHEET', 12) / 2,
    y: dHeight - 50, size: 12, font,
  });

  detailPage.drawRectangle({
    x: 40, y: dHeight - 700, width: 515, height: 600,
    borderColor: rgb(0, 0, 0), borderWidth: 1,
  });

  detailPage.drawText('Date   In Time   Out Time   KM   Halt Hrs   Parking', { x: 50, y: dHeight - 100, size: 9, font });
  detailPage.drawLine({ start: { x: 40, y: dHeight - 110 }, end: { x: 555, y: dHeight - 110 }, thickness: 0.5, color: rgb(0, 0, 0) });
  detailPage.drawText('01-06-25   09:00   18:00   120   1   200', { x: 50, y: dHeight - 125, size: 9, font });

  // Save
  const pdfBytes = await pdfDoc.save();
  this.download(pdfBytes, 'Invoice.pdf');
}

private download(pdfBytes: Uint8Array, fileName: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}


}
