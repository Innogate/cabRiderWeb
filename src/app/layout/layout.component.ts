import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from '../services/login.service';
import { decodeJwtPayload } from '../utils/global';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    MenubarModule,
    TieredMenuModule,
    MenuModule,
    BadgeModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  profileName = '';
  profileInitials = 'C';
  profileRole = '';
  constructor(private service: LoginService, private router: Router, private messageService: MessageService) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const data = decodeJwtPayload(token);
      if (data) {
        this.profileName = data.Name;
        this.profileInitials = data.Name.charAt(0);
        this.profileRole = data.Role;
      }
    }
  }
  menuItems: MenuItem[] = [
    {
      label: 'Entry',
      icon: 'pi pi-home',
      items: [
        { label: 'Booking', icon: 'pi pi-book', routerLink:'/booking'},
        { label: 'Full Booking', icon: 'pi pi-calendar-plus', routerLink:'/full-booking' },
        { label: 'Invoice Entry', icon: 'pi pi-file', routerLink:'/invoice-entry'},
        { label: 'Vendor Invoice Entry', icon: 'pi pi-file-edit',routerLink:'/vendor-invoice-entry' },
        { label: 'Fuel Entry', icon: 'pi pi-money-bill', routerLink:'/fuel-entry' },
        { label: 'Voucher Entry', icon: 'pi pi-wallet', routerLink:'/voucher-entry' },
        { label: 'Driver Attendance', icon: 'pi pi-user-edit', routerLink:'/driver-attendance' },
        { label: 'Quotation Entry', icon: 'pi pi-file', routerLink:'/quatation-entry' },
        { label: 'Opening Bill Entry', icon: 'pi pi-file-export', routerLink:'/openingbill-entry' },
        { label: 'Network Duty', icon: 'pi pi-sitemap', routerLink:'network-duty' },
      ],
    },

    {
      label: 'Report',
      icon: 'pi pi-chart-bar',
      items: [
        { label: 'Booking Register', icon: 'pi pi-book', routerLink:'/booking-register' },
        { label: 'Invoice Register', icon: 'pi pi-file', routerLink:'/invoice-register' },
        { label: 'Vendor Wise Fuel Details', icon: 'pi pi-table' },
        { label: 'Vendor Wise Fuel Summary', icon: 'pi pi-list' },
        { label: 'Pump Wise Fuel Details', icon: 'pi pi-map-marker' },
        { label: 'Car Average Statement', icon: 'pi pi-car' },
        { label: 'Due Invoice Register', icon: 'pi pi-clock' },
        { label: 'Pending Duty Slip', icon: 'pi pi-inbox' },
        { label: 'Party Vendor Dutydiff', icon: 'pi pi-sync' },
        { label: 'Driver Duty Details', icon: 'pi pi-user' },
        { label: 'Driver Salary OTsheet', icon: 'pi pi-dollar' },
        { label: 'Party Ledger', icon: 'pi pi-folder' },
        { label: 'Party Ledger Summary', icon: 'pi pi-file-o' },
        { label: 'Vendor Invoice Register', icon: 'pi pi-file' },
        { label: 'Vendor Invoice 2nd Formate', icon: 'pi pi-clone' },
      ],
    },

    {
      label: 'Master',
      icon: 'pi pi-cog',
      items: [
        { label: 'Car Type', icon: 'pi pi-car', routerLink:'master/cartype' },
        { label: 'Charges', icon: 'pi pi-dollar', routerLink:'master/charges' },
        { label: 'Driver', icon: 'pi pi-user', routerLink: 'master/driver' },
        { label: 'Driver Salary Setup', icon: 'pi pi-wallet', routerLink: 'master/driverSalary' },
        { label: 'Party', icon: 'pi pi-users', routerLink: 'master/party' },
        { label: 'Party Rate', icon: 'pi pi-percentage', routerLink: 'master/partyRate' },
        { label: 'Vendor', icon: 'pi pi-briefcase', routerLink: 'master/vendor-master' },
        { label: 'Vendor Rate', icon: 'pi pi-percentage' },
        { label: 'Guest', icon: 'pi pi-user-plus' },
        { label: 'Network', icon: 'pi pi-sitemap' },
        { label: 'User List', icon: 'pi pi-users' },
        { label: 'Monthly Duty Setup', icon: 'pi pi-calendar' },
      ]
    },
  ];

  userMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.goToProfile() },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.goToSettings() },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];

  goToProfile() {
    // Implement navigation to profile settings if needed
    // this.router.navigate(['/profile']);
  }

  logout() {
    this.service.logout();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully.' });
    this.router.navigate(['/login']);
  }

  goToSettings() {
    // Navigate to settings
    console.log("Go to Settings");
  }

}
