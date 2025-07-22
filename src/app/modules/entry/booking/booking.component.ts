import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { BookingService } from '../../../services/booking.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

import {
  formatDateDdMmYyyy,
  getRowsPerPageOptions,
  globalRequestHandler,
} from '../../../utils/global';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  imports: [
    TableModule,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TabViewModule,
    CommonModule,
    CheckboxModule,
    TooltipModule,
    DialogModule,
    ContextMenuModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit, OnDestroy, AfterViewInit {
  private searchSubject = new Subject<string>();
  constructor(
    private service: BookingService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      console.log('Debounced search:', value);
      this.onSearch(value);
      this.search();
    });
  }
  startDate = '16-05-2025';
  endDate = '15-06-2025';
  showCustomPanel = false;
  calendarReady = false;
  localStorageKey = 'customHeaders';

  tabs: string[] = [
    'All',
    'Booked',
    'Alloted',
    'Dispatched',
    'Closed',
    'Cancel',
    'Billed',
    'Cash',
    'Pending Vendor Duty',
    'Vendor Duty List',
  ];

  allHeaders: string[] = [
    'Booking No.',
    'Rental Date',
    'Reporting Time',
    'City',
    'Duty Type',
    'Party',
    'Guest Name',
    'Reporting Address',
    'Vehicle Type',
    'Drop At',
    'Vehicle No.',
    'Supplier Name / Mobile No.',
    'Driver Name / Mobile No.',
    'Booked By',
    'Remarks',
    'Invoice No',
    'Status',
  ];

  selectedHeaders: string[] = [...this.allHeaders];

  tableHeaders: string[] = [...this.allHeaders];

  headerIcons: { [key: string]: { icon: string; color: string } } = {
    'Booking No.': { icon: 'pi pi-book', color: 'text-blue-500' },
    'Rental Date': { icon: 'pi pi-calendar', color: 'text-green-500' },
    'Reporting Time': { icon: 'pi pi-clock', color: 'text-yellow-500' },
    City: { icon: 'pi pi-map-marker', color: 'text-red-500' },
    'Duty Type': { icon: 'pi pi-briefcase', color: 'text-purple-500' },
    Party: { icon: 'pi pi-users', color: 'text-pink-500' },
    'Guest Name': { icon: 'pi pi-user', color: 'text-orange-500' },
    'Reporting Address': { icon: 'pi pi-home', color: 'text-teal-500' },
    'Vehicle Type': { icon: 'pi pi-car', color: 'text-indigo-500' },
    'Drop At': { icon: 'pi pi-map', color: 'text-cyan-500' },
    'Vehicle No.': { icon: 'pi pi-hashtag', color: 'text-fuchsia-500' },
    'Supplier Name / Mobile No.': {
      icon: 'pi pi-phone',
      color: 'text-rose-500',
    },
    'Driver Name / Mobile No.': {
      icon: 'pi pi-user-plus',
      color: 'text-emerald-500',
    },
    'Booked By': { icon: 'pi pi-user-edit', color: 'text-lime-500' },
    Remarks: { icon: 'pi pi-comment', color: 'text-amber-500' },
    'Invoice No': { icon: 'pi pi-file', color: 'text-teal-500' },
    Status: { icon: 'pi pi-info-circle', color: 'text-sky-500' },
  };

  statusColors: { [key: string]: string } = {
    Booked: 'bg-blue-100 text-blue-800',
    Alloted: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-gray-100 text-gray-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  tableData: any[] = [];
  tableLoading = true;
  totalRecords = 0;
  pageNo: any = 1;
  pageSize: any = 10;
  searchValue: any = '';
  status: any = 'All';
  sortBy: any = 'desc';
  isLazyLoad = false;

  contextMenuItems?: MenuItem[];
  selectedRow: any;
  isFullBooking = false;
  ngOnInit(): void {
    this.isFullBooking = this.route.snapshot.data['isFullBooking'] ?? false;
    this.loadHeaderPreferences();
    this.contextMenuItems = [
      { label: 'View/Edit', icon: 'pi pi-pencil', command: () => this.onMenuAction('View/Edit') },
      { label: 'Allot Cab Details', icon: 'pi pi-external-link', command: () => this.onMenuAction('Allot Cab Details') },
      { label: 'Slip Print - Half Page', icon: 'pi pi-print', command: () => this.onMenuAction('Slip Print - Half Page') },
      { label: 'Slip Print - Full Page', icon: 'pi pi-print', command: () => this.onMenuAction('Slip Print - Full Page') },
      { label: 'Mark as Dispatched', icon: 'pi pi-check-square', command: () => this.onMenuAction('Mark as Dispatched') },
      { label: 'Send SMS', icon: 'pi pi-send', command: () => this.onMenuAction('Send SMS') },
      { label: 'Send Whatsapp', icon: 'pi pi-whatsapp', command: () => this.onMenuAction('Send Whatsapp') },
      { label: 'Email Info', icon: 'pi pi-envelope', command: () => this.onMenuAction('Email Info') },
      { label: 'Close Duty', icon: 'pi pi-times-circle', command: () => this.onMenuAction('Close Duty') },
      { label: 'Cancel Duty', icon: 'pi pi-ban', command: () => this.onMenuAction('Cancel Duty') },
      { label: 'Vendor Duty Close', icon: 'pi pi-user-minus', command: () => this.onMenuAction('Vendor Duty Close') },
      { label: 'Repeat Booking', icon: 'pi pi-refresh', command: () => this.onMenuAction('Repeat Booking') },
      { label: 'Send to Network', icon: 'pi pi-share-alt', command: () => this.onMenuAction('Send to Network') },
      { label: 'Update Information', icon: 'pi pi-info-circle', command: () => this.onMenuAction('Update Information') }
    ];

    this.service.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'bookingTableData') {
          console.log(msg.data);
          this.tableData = msg.data.map((booking: any) => this.mapBookingToRow(booking));
          this.cdr.detectChanges();
          if (msg.total > 0) {
            this.totalRecords = msg.total;
            this.isLazyLoad = true;
          }
          this.tableLoading = false;
        }
        rt = true;
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.startDate = formatDateDdMmYyyy(oneMonthAgo);
    this.endDate = formatDateDdMmYyyy(today);
    this.search();

  }

  ngAfterViewInit(): void { }

  loadHeaderPreferences() {
    const saved = localStorage.getItem(this.localStorageKey);
    if (saved) {
      try {
        this.selectedHeaders = JSON.parse(saved);
      } catch (e) {
        console.warn('Error loading header settings:', e);
        this.selectedHeaders = [...this.allHeaders];
      }
    } else {
      this.selectedHeaders = [...this.allHeaders];
    }
  }

  onMenuAction(action: string) {
    console.log(`Action: ${action}`, this.selectedRow);
  }

  loadData($event: any) {
    if (!this.isLazyLoad) {
      return;
    }
    if ($event.first) {
      this.pageNo = $event.first / $event.rows + 1;
    }
    this.search();
  }

  ngOnDestroy(): void {
    this.service.unregisterPageHandler();
  }

  toggleCustomPanel() {
    this.showCustomPanel = !this.showCustomPanel;
  }

  onTabChange($event: TabViewChangeEvent) {
    this.status = this.tabs[$event.index];
    this.search();
  }

  onDateSelect($event: any) {
    console.log($event);
    this.search();
  }

  areAllSelected(): boolean {
    return this.selectedHeaders.length === this.allHeaders.length;
  }

  toggleSelectAll(): void {
    if (this.areAllSelected()) {
      this.selectedHeaders = [];
    } else {
      this.selectedHeaders = [...this.allHeaders];
    }
    this.filterHeaders();
  }

  filterHeaders(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.selectedHeaders));
    this.tableHeaders = this.allHeaders.filter((header) =>
      this.selectedHeaders.includes(header)
    );

    // Maintain selectedHeaders order same as allHeaders
    this.selectedHeaders = this.allHeaders.filter((header) =>
      this.selectedHeaders.includes(header)
    );
  }


  search() {
    this.tableLoading = true;
    this.service.search({
      from_date: this.startDate,
      to_date: this.endDate,
      searchValue: this.searchValue,
      status: this.status,
      sort_by: this.sortBy,
      pageSize: this.pageSize,
      pageNo: this.pageNo,
    });
  }

  formatSupplier(booking: any): string | null {
    const name = booking.Vendor_name || booking.VendorName || booking.supplier || '';
    const mobile = booking.Vendor_mobile || booking.VendorContact || '';
    const combined = `${name} ${mobile}`.trim();
    return combined && combined !== '/' ? combined : null;
  }

  formatDriver(booking: any): string | null {
    const driverRaw = booking.DriverName || booking.driver || '';
    const contact = booking.DriverContact || '';

    if (driverRaw.includes('/')) return driverRaw; // already formatted
    const combined = `${driverRaw} ${contact}`.trim();
    return combined && combined !== '/' ? combined : null;
  }


  mapBookingToRow(booking: any): any {
    const row: { [key: string]: any } = {};

    const values = [
      booking.SlipNo ?? null,
      booking.RentalDate ?? null,
      booking.ReportingDatetime ?? null,
      booking.from_city ?? null,
      booking.DutyType ?? null,
      booking.Party ?? null,
      booking.ViewGustName ?? null,
      booking.ViewAddress ?? null,
      booking.CarType ?? null,
      booking.ViewDropAddress ?? null,
      booking.VehicleNo ?? null,
      this.formatSupplier(booking),
      this.formatDriver(booking),
      booking.BookedBy ?? null,
      booking.Remarks ?? null,
      booking.InvoiceNo ?? null,
      booking.BookingStatus ?? null
    ];

    this.allHeaders.forEach((header, i) => {
      row[header] = values[i];
    });

    return row;
  }

  reset() {
    this.searchValue = '';
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.startDate = formatDateDdMmYyyy(oneMonthAgo);
    this.endDate = formatDateDdMmYyyy(today);
    this.search();
  }
goToAdd() {
  if (this.isFullBooking) {
    this.router.navigate(['/add-full-booking']);
  } else {
    this.router.navigate(['/add-booking']);
  }
}


  onSearch(text: any) {
    this.searchSubject.next(text);
    this.searchValue = text;
  }
}
