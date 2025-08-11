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



    protected handleMessage(msg: any): boolean {
        return false;
    }
}
