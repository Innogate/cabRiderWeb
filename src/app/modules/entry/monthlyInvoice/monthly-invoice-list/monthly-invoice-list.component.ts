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

invoiceData = {
  companyName: 'Darwar Enterprise',
  address: '7/1/1, Bijay Basu Road Kolkata 700025, West Bengal (WB-19)',
  phone: '9748600670 / 9331293690 / 8113136860',
  email: 'darwarenterprise@gmail.com',
  invoiceNo: 'DE/584/25-26',
  invoiceDate: '05-07-25',
  recipient: 'STATE BANK OF INDIA (IFB KOLKATA BRANCH)',
  addressLine1: '1, Middleton Street',
  addressLine2: 'Kolkata : 700071',
  carType: 'HONDA CITY',
  category: '1500 KM/252 Hrs',
  items: [
    { particulars: 'Being monthly hire charges (01/06/2025 to 30/06/2025)', amount: '63000.00' },
    { particulars: 'Extra Hour(s) 100.25 X 75', amount: '7518.75' },
    { particulars: 'Extra KM 780 X 20', amount: '15600.00' },
    { particulars: 'Gross Total', amount: '86818.75' },
    { particulars: 'CGST @ 6%', amount: '5167.13' },
    { particulars: 'SGST @ 6%', amount: '5167.13' },
    { particulars: 'Holiday days (8 X 500)', amount: '4000.00' },
    { particulars: 'Other Charges', amount: '9950.00' },
    { particulars: 'Total Amount Payable', amount: '111103.00' },
  ],
};

logRows = [
  { carNo: '601', outDate: '01-06-25', outTime: '11:30', inDate: '01-06-25', inTime: '23:30', outKM: '62277', inKM: '62327', totalHrs: '12:00', totalKM: '50', overTime: '0', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
  { carNo: '601', outDate: '02-06-25', outTime: '08:00', inDate: '02-06-25', inTime: '23:30', outKM: '62327', inKM: '62406', totalHrs: '15:30', totalKM: '79', overTime: '3.50', parking: '0', nightHalt: '200' },
];

async generatePdf(invoiceData = this.invoiceData, logRows = this.logRows) {
  const pdfDoc = await PDFDocument.create();

  //
  // FIRST PAGE – Invoice
  //
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  // Header (Centered)
  page.drawText(invoiceData.companyName, {
    x: width / 2 - font.widthOfTextAtSize(invoiceData.companyName, 14) / 2,
    y: height - 50,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(invoiceData.address, {
    x: width / 2 - font.widthOfTextAtSize(invoiceData.address, 10) / 2,
    y: height - 70,
    size: 10,
    font,
  });
  page.drawText(`Phone: ${invoiceData.phone}`, {
    x: width / 2 - font.widthOfTextAtSize(`Phone: ${invoiceData.phone}`, 10) / 2,
    y: height - 85,
    size: 10,
    font,
  });
  page.drawText(`Email: ${invoiceData.email}`, {
    x: width / 2 - font.widthOfTextAtSize(`Email: ${invoiceData.email}`, 10) / 2,
    y: height - 100,
    size: 10,
    font,
  });

  // TAX INVOICE title with underline
  const title1 = 'TAX INVOICE';
  const title1Width = font.widthOfTextAtSize(title1, 12);
  const title1X = width / 2 - title1Width / 2;
  const title1Y = height - 130;
  page.drawText(title1, { x: title1X, y: title1Y, size: 12, font });
  page.drawLine({
    start: { x: title1X - 10, y: title1Y - 5 },
    end:   { x: title1X + title1Width + 10, y: title1Y - 5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Left “To” section
  page.drawText('To,', { x: 50, y: height - 170, size: 10, font });
  page.drawText(invoiceData.recipient, { x: 50, y: height - 185, size: 10, font });
  page.drawText(invoiceData.addressLine1, { x: 50, y: height - 200, size: 10, font });
  page.drawText(invoiceData.addressLine2, { x: 50, y: height - 215, size: 10, font });

  // Right invoice details (no border)
  const infoX = 350;
  const infoY = height - 170;
  [
    `Tax Invoice No.: ${invoiceData.invoiceNo}`,
    `Tax Invoice Date: ${invoiceData.invoiceDate}`,
    `Classification: RENT-A-CAR`,
    `Place of Supply: Kolkata`,
    `Car Type: ${invoiceData.carType}`,
    `Category: ${invoiceData.category}`,
  ].forEach((text, i) => {
    page.drawText(text, { x: infoX, y: infoY - i * 15, size: 9, font });
  });

  // Item table rows with borders
  const tableX = 40;
  const tableY = height - 300;
  const tableWidth = 515;
  const rowH = 25;
  invoiceData.items.forEach((row, idx) => {
    const top = tableY - idx * rowH;
    page.drawRectangle({
      x: tableX,
      y: top - rowH,
      width: tableWidth,
      height: rowH,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.8,
    });
    page.drawText(row.particulars, {
      x: tableX + 5,
      y: top - 17,
      size: 9,
      font,
    });
    page.drawText(row.amount, {
      x: tableX + tableWidth - 80,
      y: top - 17,
      size: 9,
      font,
    });
  });

  // Footer note
  page.drawText('Release payment within forty one days.\nFor Darwar Enterprise', {
    x: 50,
    y: 70,
    size: 10,
    font,
  });

  // SECOND PAGE – DETAIL SHEET / Logsheet
const detailPage = pdfDoc.addPage([595.28, 841.89]);
const dFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
const dW = detailPage.getSize().width;
const dH = detailPage.getSize().height;

// Header centered
detailPage.drawText(invoiceData.companyName, {
  x: dW / 2 - dFont.widthOfTextAtSize(invoiceData.companyName, 13) / 2,
  y: dH - 50,
  size: 13,
  font: dFont,
});
detailPage.drawText(invoiceData.address, {
  x: dW / 2 - dFont.widthOfTextAtSize(invoiceData.address, 9) / 2,
  y: dH - 65,
  size: 9,
  font: dFont,
});
detailPage.drawText(`Phone - ${invoiceData.phone}`, {
  x: dW / 2 - dFont.widthOfTextAtSize(`Phone - ${invoiceData.phone}`, 9) / 2,
  y: dH - 80,
  size: 9,
  font: dFont,
});
detailPage.drawText(`E-Mail - ${invoiceData.email}`, {
  x: dW / 2 - dFont.widthOfTextAtSize(`E-Mail - ${invoiceData.email}`, 9) / 2,
  y: dH - 95,
  size: 9,
  font: dFont,
});

// DETAIL SHEET title + underline
const title2 = 'DETAIL SHEET';
const title2W = dFont.widthOfTextAtSize(title2, 12);
const title2X = dW / 2 - title2W / 2;
const title2Y = dH - 120;
detailPage.drawText(title2, { x: title2X, y: title2Y, size: 12, font: dFont });
detailPage.drawLine({
  start: { x: title2X - 10, y: title2Y - 5 },
  end: { x: title2X + title2W + 10, y: title2Y - 5 },
  thickness: 1,
  color: rgb(0, 0, 0),
});

// Left "To" section
detailPage.drawText('To,', { x: 50, y: dH - 150, size: 10, font: dFont });
detailPage.drawText(invoiceData.recipient, { x: 50, y: dH - 165, size: 10, font: dFont });
detailPage.drawText(invoiceData.addressLine1, { x: 50, y: dH - 180, size: 10, font: dFont });
detailPage.drawText(invoiceData.addressLine2, { x: 50, y: dH - 195, size: 10, font: dFont });

// Right invoice details
const diX = 350;
[
  `Tax Invoice No. : ${invoiceData.invoiceNo}`,
  `Tax Invoice Date : ${invoiceData.invoiceDate}`,
  `Classification : RENT-A-CAR`,
  `Place of Supply : Kolkata`,
  `Car Type : ${invoiceData.carType}`,
  `Category : ${invoiceData.category}`,
].forEach((text, i) => {
  detailPage.drawText(text, { x: diX, y: dH - 150 - i * 15, size: 9, font: dFont });
});

// Table setup with TIGHTER columns
const tblX = 40;
const tblY = dH - 240;
const tblW = 515;
const rowH2 = 16; // Reduced row height for tighter spacing
const totalRows = logRows.length + 2;

// Draw outer table border
detailPage.drawRectangle({
  x: tblX,
  y: tblY - rowH2 * totalRows,
  width: tblW,
  height: rowH2 * totalRows,
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// Define columns with MUCH TIGHTER widths like the original
const cols = [
  { h: 'Car No.', x: tblX, w: 35 },
  { h: 'Out Date', x: tblX + 35, w: 45 },
  { h: 'Out Time', x: tblX + 80, w: 40 },
  { h: 'In Date', x: tblX + 120, w: 45 },
  { h: 'In Time', x: tblX + 165, w: 40 },
  { h: 'Out KM', x: tblX + 205, w: 40 },
  { h: 'IN KM', x: tblX + 245, w: 40 },
  { h: 'Total Hrs', x: tblX + 285, w: 45 },
  { h: 'Total KM', x: tblX + 330, w: 40 },
  { h: 'Over Time', x: tblX + 370, w: 45 },
  { h: 'Parking', x: tblX + 415, w: 35 },
  { h: 'Night Halt', x: tblX + 450, w: 45 },
];

// Draw header row with smaller font
const headerY = tblY - rowH2;
cols.forEach(({ h, x, w }, i) => {
  detailPage.drawText(h, { 
    x: x + 1, 
    y: headerY + 4, 
    size: 6, // Smaller font for header
    font: dFont 
  });
  
  // Draw vertical lines
  detailPage.drawLine({
    start: { x: x + w, y: tblY },
    end: { x: x + w, y: tblY - rowH2 * totalRows },
    thickness: 0.3,
    color: rgb(0, 0, 0),
  });
});

// Draw horizontal line after header
detailPage.drawLine({
  start: { x: tblX, y: headerY },
  end: { x: tblX + tblW, y: headerY },
  thickness: 0.5,
  color: rgb(0, 0, 0),
});

// Draw data rows with TIGHTER spacing
logRows.forEach((r, ri) => {
  const currentRowY = tblY - rowH2 * (ri + 2);
  const vals = [
    r.carNo, r.outDate, r.outTime, r.inDate, r.inTime,
    r.outKM, r.inKM, r.totalHrs, r.totalKM, r.overTime,
    r.parking, r.nightHalt
  ];
  
  // Draw data in each cell with smaller font and tight spacing
  cols.forEach((c, ci) => {
    detailPage.drawText(vals[ci] ?? '', {
      x: c.x + 1, // Minimal padding
      y: currentRowY + 3,
      size: 6, // Smaller font for data
      font: dFont
    });
  });
  
  // Draw horizontal line after each row
  detailPage.drawLine({
    start: { x: tblX, y: currentRowY },
    end: { x: tblX + tblW, y: currentRowY },
    thickness: 0.2,
    color: rgb(0, 0, 0),
  });
});

// Draw totals row
const totalsY = tblY - rowH2 * totalRows;
const totals = ['', '', '', '', '', '', '', '433:00', '2280', '100.25', '3690.00', '4200.00'];
cols.forEach((c, ci) => {
  if (totals[ci]) {
    detailPage.drawText(totals[ci], {
      x: c.x + 1,
      y: totalsY + 3,
      size: 6,
      font: dFont
    });
  }
});

// Footer
detailPage.drawText('for Darwar Enterprise', {
  x: 450,
  y: 50,
  size: 10,
  font: dFont,
});



  // Save & download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Invoice_DetailSheet.pdf';
  link.click();
}




private download(pdfBytes: Uint8Array, fileName: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}


}
