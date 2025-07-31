import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './modules/login/login.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { AuthGuard } from './guard/auth.guard';
import { BookingComponent } from './modules/entry/booking/booking.component';
import { InvoiceEntryComponent } from './modules/entry/invoice-entry/invoice-entry.component';
import { VendorInvoiceEntryComponent } from './modules/entry/vendor-invoice-entry/vendor-invoice-entry.component';
import { VoucherEntryComponent } from './modules/entry/voucher-entry/voucher-entry.component';
import { BookingEntryComponent } from './modules/entry/booking/booking-entry/booking-entry.component';
import { CarTypeMasterComponent } from './modules/master/car-type-master/car-type-master.component';
import { ChargeListMasterComponent } from './modules/master/charge-list-master/charge-list-master.component';
import { DriverMasterComponent } from './modules/master/driver-master/driver-master.component';
import { DriverSalarySetupMasterComponent } from './modules/master/driver-salary-setup-master/driver-salary-setup-master.component';
import { PartyMasterComponent } from './modules/master/party-master/party-master.component';
import { FuelEntryComponent } from './modules/entry/fuel-entry/fuel-entry.component';
import { DriverAttendanceComponent } from './modules/entry/driver-attendance/driver-attendance.component';
import { QuatationEntryComponent } from './modules/entry/quatation-entry/quatation-entry.component';
import { OpeningbillEntryComponent } from './modules/entry/openingbill-entry/openingbill-entry.component';
import { NetworkDutyComponent } from './modules/entry/network-duty/network-duty.component';
import { BookingRegisterComponent } from './modules/report/booking-register/booking-register.component';
import { InvoiceRegisterComponent } from './modules/report/invoice-register/invoice-register.component';
import { InvoiceAddComponent } from './modules/entry/invoice-add/invoice-add.component';

import { PartyRateMasterComponent } from './modules/master/party-rate-master/party-rate-master.component';
import { VendorMasterComponent } from './modules/master/vendor-master/vendor-master.component';
import { FullBookingEntryComponent } from './modules/entry/booking/full-booking-entry/full-booking-entry.component';
import { AddNewVendorInvoiceComponent } from './modules/entry/vendor-invoice-entry/add-new-vendor-invoice/add-new-vendor-invoice.component';
import { InvoiceEyesShowComponent } from './components/invoice-eyes-show/invoice-eyes-show.component';
import { UserListMasterComponent } from './modules/master/user-list-master/user-list-master.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'bar', component: LoginComponent, canActivate: [AuthGuard] },
            { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
            { path: 'full-booking', component: BookingComponent, data: { isFullBooking: true }, canActivate: [AuthGuard] },
            { path: 'add-booking', component: BookingEntryComponent, data: { isFullBooking: true }, canActivate: [AuthGuard] },
            { path: 'invoice-entry', component: InvoiceEntryComponent, canActivate: [AuthGuard] },
            { path: 'vendor-invoice-entry', component: VendorInvoiceEntryComponent, canActivate: [AuthGuard] },
           //added
            {path: 'add-new-vendor-invoice', component: AddNewVendorInvoiceComponent,canActivate: [AuthGuard]},

            { path: 'master/cartype', component: CarTypeMasterComponent, canActivate: [AuthGuard] },
            { path: 'master/charges', component: ChargeListMasterComponent, canActivate: [AuthGuard] },
            { path: 'master/driver', component: DriverMasterComponent, canActivate: [AuthGuard] },
            { path: 'master/driverSalary', component: DriverSalarySetupMasterComponent, canActivate: [AuthGuard] },
            { path: 'master/party', component: PartyMasterComponent, canActivate: [AuthGuard] },
            { path: 'voucher-entry', component: VoucherEntryComponent, canActivate: [AuthGuard] },
            { path: 'fuel-entry', component: FuelEntryComponent, canActivate: [AuthGuard] },
            { path: 'add-booking', component: BookingEntryComponent, canActivate: [AuthGuard] },
            { path: 'add-full-booking', component: FullBookingEntryComponent, canActivate: [AuthGuard] },
            { path: 'driver-attendance', component: DriverAttendanceComponent, canActivate: [AuthGuard] },
            { path: 'quatation-entry', component: QuatationEntryComponent, canActivate: [AuthGuard] },
            { path: 'openingbill-entry', component: OpeningbillEntryComponent, canActivate: [AuthGuard] },
            { path: 'network-duty', component: NetworkDutyComponent, canActivate: [AuthGuard] },
            { path: 'booking-register', component: BookingRegisterComponent, canActivate: [AuthGuard] },
            { path: 'invoice-register', component: InvoiceRegisterComponent, canActivate: [AuthGuard] },
            { path: 'master/partyRate', component: PartyRateMasterComponent, canActivate: [AuthGuard] },
            { path: 'invoice-add', component: InvoiceAddComponent, canActivate: [AuthGuard] },

            { path: 'master/vendor-master', component: VendorMasterComponent, canActivate: [AuthGuard] },

            { path: 'master/user-master', component: UserListMasterComponent, canActivate: [AuthGuard] },
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    { path: '**', component: NotFoundComponent }

];
