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
  charges: any[] = [];
  taxableCharges: any;
  sleetedBookingIds: any;
  nonTaxableCharges: any;
  selectedInvoice: any;
  party_info: any;


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
       if ((msg.for === 'getOtherTaxableChargesUsingId'))
        {
        this.taxableCharges = msg.data?.taxable ? [...msg.data?.taxable] : [];
        rt = true;
      }
      else if ((msg.for === 'getOtherNonTaxableChargesUsingId'))
      {
        this.nonTaxableCharges = msg.data?.nonTaxable ? [ ...msg.data?.nonTaxable] : [];
        rt = true;
      }
      else if ((msg.for ==='partyinfo')){
        this.party_info = msg.data;
        console.log("party_info:",this.party_info)
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

  updateCharges(event: {
  taxableCharges: any[];
  nonTaxableCharges: any[];
  sleetedBookingIds?: any[];
  charges: any[];
  }) {
    this.charges = event.charges;
    this.taxableCharges = event.taxableCharges;
    this.nonTaxableCharges = event.nonTaxableCharges;
    this.sleetedBookingIds = event.sleetedBookingIds;

    console.log('Duty Updated:', {
      charges: this.charges,
      taxableCharges: this.taxableCharges,
      nonTaxableCharges: this.nonTaxableCharges,
      sleetedBookingIds: this.sleetedBookingIds,

    });
  }


  getTaxableCharges(invoice_id:any) {
  // this._helper.getOtherChargesForMonthlyInvoice({ booking_entry_id })
  if (invoice_id) {
    console.log('Fetching charges for invoice:', invoice_id);
    this.HelperService.getTaxableOtherChargesForMonthlyInvoice({ booking_entry_id: invoice_id });
  } else {
    console.error("No selected invoice to fetch charges for.");
  }
}

getNonTaxableCharges(invoice_id: any) {
  if (invoice_id) {
    console.log('Fetching non-taxable charges for invoice:',invoice_id);
    this.HelperService.getNonTaxableOtherChargesForMonthlyInvoice({ booking_entry_id: invoice_id });
  } else {
    console.error("No selected invoice to fetch non-taxable charges for.");
  }
}



getPartyinfoForPdf(invoice_id:any){
    this.HelperService.getPartyinfoForPdf({invoice_id:(invoice_id)});
}



async generatePdf(invoice: any, charges: any, party_info:any) {
  console.log('Generating PDF for invoice:', invoice);
  console.log('Charges:', charges);

  // Fetch charges
  this.getTaxableCharges(invoice.id);
  await this.waitForFetch(() => this.taxableCharges);
  this.getPartyinfoForPdf(invoice.id);
  await this.waitForFetch(() => this.party_info);
  this.getNonTaxableCharges(invoice.id);
  this.taxableCharges = this.taxableCharges ?? [];
  this.nonTaxableCharges = this.nonTaxableCharges ?? [];
  this.party_info = this.party_info ?? [];

  charges = this.taxableCharges.concat(this.nonTaxableCharges);
  party_info = this.party_info
  const party = (this.party_info && this.party_info[0]) || {};
  console.log("Final charges: ", charges);
  console.log("party:", party_info);

  const invoiceData = {
    companyName: party.Company_Name ?? '',
    address: (party.partyaddress ?? '').replace(/\t/g, '').replace(/\r?\n/g, ''),
    phone: party.Branch_PhoneNo ?? '',
    email: party.Branch_Email ?? '',
    invoiceNo: invoice.BillNo ?? '',
    invoiceDate: this.formatDate(invoice.BillDate),
    recipient: ` ${party.BankName} ( ${party.BankIFSC})`,
    addressLine1: party.branch_address ?? '',
    addressLine2: party.BankAddress ?? '',
    state_code: party.Party_StateName ?? '',
    partygstNo: party.PartyGSTNo ?? '',
    carType: 'HONDA CITY',
    category: '1500 KM/252 Hrs',
    items: [
      { particulars: 'Being monthly hire charges (01/06/2025 to 30/06/2025)', amount: String(invoice.amount ?? 'N/A') },
      { particulars: 'Add : Extra Hour(s)         100.25 X 75', amount: String(invoice.extra_hours ?? '0.00') },
      { particulars: 'Add : Extra KM              780 X 20', amount: String(invoice.extra_km ?? '0.00') },
      { particulars: 'Gross Total', amount: String(invoice.GrossAmount ?? '0.00') },
      { particulars: `Other Charges Taxable`, amount: String('0.00') },
      { particulars: 'Parking', amount: String('0.00') },
      { particulars: 'Night Halt', amount: String(invoice.nightHalt ??'0.00') },
      { particulars: `Add : CGST @ ${invoice.CGSTPer}%`, amount: String(invoice.CGST ?? '0.00') },
      { particulars: `Add : SGST @ ${invoice.SGSTPer}%`, amount: String(invoice.SGST ?? '0.00') },
      { particulars: 'Other Charges NonTaxable Table', amount: String('0.00') },
      { particulars: 'Driver Halt', amount: String('0.00') },
      { particulars: 'Round OFF', amount: String(invoice.round_off ?? '0.00') },
      { particulars: `Net Amount (Rupees ${party.AmtInWords ?? ''})`, amount: String(invoice.NetAmount ?? '0.00') },
      { particulars: `GST No : ${party.PartyGSTNo}`, amount: '' },
      { particulars: `PAN NO : ${party.PartyPanNo }`, amount:'' },
      { particulars: 'SAC Code : 7589J', amount:'' },
    ],
  };

  // Prepare log rows
  const logRows = charges.map((charge: any) => ({
    carNo: charge.CarNo,
    outDate: this.formatDate(charge.GarageOutDate),
    outTime: charge.GarageOutTime,
    inDate: this.formatDate(charge.GarageInDate),
    inTime: charge.EntryTime,
    outKM: charge.GarageOutKm,
    inKM: charge.GarageInKm,
    totalHrs: charge.TotalHour,
    totalKM: charge.TotalKm,
    overTime: charge.ExtraHrs,
    parking: charge.charge_name,
    nightHalt: invoice?.nightHalt ?? null,
  }));

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // -------------------- FIRST PAGE --------------------
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

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

  const title1 = 'TAX INVOICE';
  const title1Width = font.widthOfTextAtSize(title1, 12);
  const title1X = width / 2 - title1Width / 2;
  const title1Y = height - 130;
  page.drawText(title1, { x: title1X, y: title1Y, size: 12, font });
  page.drawLine({
    start: { x: title1X - 10, y: title1Y - 5 },
    end: { x: title1X + title1Width + 10, y: title1Y - 5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawText('To,', { x: 50, y: height - 170, size: 10, font });
  page.drawText(invoiceData.recipient, { x: 50, y: height - 185, size: 10, font });
  page.drawText(invoiceData.addressLine1, { x: 50, y: height - 200, size: 10, font });
  page.drawText(invoiceData.addressLine2, { x: 50, y: height - 215, size: 10, font });

  page.drawText(invoiceData.state_code, { x: 50, y: height - 230, size: 10, font });
  page.drawText(invoiceData.partygstNo, { x: 50, y: height - 245, size: 10, font });

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

  // Item table
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
    page.drawText(row.particulars, { x: tableX + 5, y: top - 17, size: 9, font });
    page.drawText(row.amount, { x: tableX + tableWidth - 80, y: top - 17, size: 9, font });
  });

  page.drawText('Release payment within forty one days.\nFor Darwar Enterprise', {
    x: 50,
    y: 70,
    size: 10,
    font,
  });

  // -------------------- SECOND PAGE --------------------
  const detailPage = pdfDoc.addPage([595.28, 841.89]);
  const dFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const dW = detailPage.getSize().width;
  const dH = detailPage.getSize().height;

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

  detailPage.drawText('To,', { x: 50, y: dH - 150, size: 10, font: dFont });
  detailPage.drawText(invoiceData.recipient, { x: 50, y: dH - 165, size: 10, font: dFont });
  detailPage.drawText(invoiceData.addressLine1, { x: 50, y: dH - 180, size: 10, font: dFont });
  detailPage.drawText(invoiceData.addressLine2, { x: 50, y: dH - 195, size: 10, font: dFont });

  detailPage.drawText(invoiceData.state_code, { x: 50, y: dH - 210, size: 10, font: dFont });
  detailPage.drawText(invoiceData.partygstNo, { x: 50, y: dH - 220, size: 10, font: dFont });

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

  // -------------------- DYNAMIC TABLE WITH OUTER BORDER --------------------
  const tblX2 = 40;
  const tblY2 = dH - 240;
  const rowH2 = 16;
  const colHeaders = ['Car No.', 'Out Date', 'Out Time', 'In Date', 'In Time', 'Out KM', 'IN KM', 'Total Hrs', 'Total KM', 'Over Time', 'Parking', 'Night Halt'];
  const numCols = colHeaders.length;
  const tblW2 = 515;
  const colWidth = tblW2 / numCols;

  const cols = colHeaders.map((h, i) => ({ h, x: tblX2 + i * colWidth, w: colWidth }));
  const totalRows = logRows.length + 1; // +1 for header
  const tableHeight = rowH2 * totalRows;

  // Draw outer table rectangle
  detailPage.drawRectangle({
    x: tblX2,
    y: tblY2 - tableHeight,
    width: tblW2,
    height: tableHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Draw header
  const headerY2 = tblY2 - rowH2;
  cols.forEach(c => {
    detailPage.drawText(c.h, { x: c.x + 1, y: headerY2 + 4, size: 6, font: dFont });
  });

  // Vertical lines
  cols.forEach(c => {
    detailPage.drawLine({
      start: { x: c.x + c.w, y: tblY2 },
      end: { x: c.x + c.w, y: tblY2 - tableHeight },
      thickness: 0.3,
      color: rgb(0, 0, 0),
    });
  });

  // Horizontal line after header
  detailPage.drawLine({
    start: { x: tblX2, y: headerY2 },
    end: { x: tblX2 + tblW2, y: headerY2 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  // Data rows
  logRows.forEach((r:any, ri:number) => {
    const currentY = tblY2 - rowH2 * (ri + 2);
    const vals = [r.carNo, r.outDate, r.outTime, r.inDate, r.inTime, r.outKM, r.inKM, r.totalHrs, r.totalKM, r.overTime, r.parking, r.nightHalt];

    cols.forEach((c, ci) => {
      if (vals[ci] != null) {
        let text = String(vals[ci]);
        while (dFont.widthOfTextAtSize(text, 6) > c.w - 2) text = text.slice(0, -1);
        detailPage.drawText(text, { x: c.x + 1, y: currentY + 3, size: 6, font: dFont });
      }
    });

    // Horizontal line for row
    detailPage.drawLine({
      start: { x: tblX2, y: currentY },
      end: { x: tblX2 + tblW2, y: currentY },
      thickness: 0.2,
      color: rgb(0, 0, 0),
    });
  });

  // Footer
  detailPage.drawText('for Darwar Enterprise', { x: 450, y: 50, size: 10, font: dFont });

  // Save & download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Invoice_DetailSheet.pdf';
  link.click();
}






 numberToWords(amount: number): string {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  return amount ? amount.toLocaleString('en-IN') : "0";
}

formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(d.getFullYear()).slice(-2); // last 2 digits
  return `${day}-${month}-${year}`;
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
