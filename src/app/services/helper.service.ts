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

    getBranchDropdown() {
        this.call('helper.getBranchDropdown', {});
    }

    getCompanyDropdown() {
        this.call('helper.getCompanyDropdown', {});
    }



    protected handleMessage(msg: any): boolean {
        return false;
    }
}
