import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class HelperService extends BaseService {
    constructor(ws: WebSocketService) {
        super(ws);
    }

    getPartyDropdown() {
        this.call('helper.getPartyDropdown', {});
    }

    getBranchDropdown(company_id: number) {
        this.call('helper.getBranchDropdown', {
            company_id: company_id
        });
    }

    getCompanyDropdown() {
        this.call('helper.getCompanyDropdown', {});
    }

    getPartyById(party_id: number) {
        this.call('helper.getPartyById', {
            party_id: party_id
        });
    }

    getOtherChargesForBookingList(booking_ids: any[]) {
        this.call('helper.getOtherChargesForBookingList', {
            booking_ids: booking_ids
        });
    }


     getMonthlyInvoiceList(payload:any){
    this.call('minvoice.getMonthlyInvoiceList', payload);
  }

  getOtherChargesForMonthlyInvoice(payload: any) {
        this.call('helper.getOtherChargesForMonthlyInvoice', payload);
    }


  getTaxableOtherChargesForMonthlyInvoice(payload: any) {
        this.call('helper.getTaxableOtherChargesForMonthlyInvoice', payload);
    }

    getNonTaxableOtherChargesForMonthlyInvoice(payload: any) {
        this.call('helper.getNonTaxableOtherChargesForMonthlyInvoice', payload);
    }

    protected handleMessage(msg: any): boolean {
        return false;
    }
}
