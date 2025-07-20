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
import { InvoiceService } from '../../../services/invoice.service';
import { globalRequestHandler } from '../../../utils/global';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Dialog, DialogModule } from "primeng/dialog";
import { Calendar, CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-invoice-entry',
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
],
  templateUrl: './invoice-entry.component.html',
  styleUrl: './invoice-entry.component.css',
})
export class InvoiceEntryComponent implements OnInit {
  invoices?: any;
  companies = ['All', 'LC','GD','UD','AZ','ATT'];
  selectedCompany: string | null = null;
  searchText: string = '';
  selectedShow: number | null = 10;
  show = [10,25,50,100,200,400,500,1000,2000];

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
  ) {}

  ngOnInit(): void {
    this._invoice.registerPageHandler((msg)=>{
      console.log(msg);
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'invoiceTableData') {
          console.log(msg.data);
          this.invoices = msg.data;
          console.log(this.invoices);
          this.cdr.detectChanges();
          if (msg.total > 0) {
            this.totalRecords = msg.total;
            this.isLazyLoad = true;
          }
          this.tableLading = false;
        }
        rt = true;
      }
      this.tableLading = false;
      return rt;
    });

    this.getInvoices();
  }
  loadData($event: any) {
    if (!this.isLazyLoad) {
      return;
    }
    if ($event.first) {
      this.pageNo = $event.first / $event.rows + 1;
    }
    this.getInvoices();
  }


  getInvoices() {
    this.tableLading = true;
    this._invoice.search({
      "page": this.pageNo,
      "pageSize": this.dataCount ,
      "sortColumn": "1",
      "sortOrder": "ASC",
      "sub_company_id": this.selectedCompany,
      "search": this.searchText
    })
  }

searchInvoices() {
  this.pageNo = 1;
  this.getInvoices();
}

resetFilters() {
  this.searchText = '';
  this.selectedCompany = null;
}

goToAdd() {
    this.router.navigate(['/invoice-add'])
  }

}
