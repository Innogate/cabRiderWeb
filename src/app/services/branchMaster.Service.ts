import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class branchMasterService extends BaseService {
    reset() {
      throw new Error('Method not implemented.');
    }
    value(arg0: string, value: any) {
      throw new Error('Method not implemented.');
    }
    valid: any;
    createUpdateUser(value: any) {
      throw new Error('Method not implemented.');
    }
    constructor(ws: WebSocketService) {
        super(ws);
    }

    getAllbranch(payload: any) {
        this.call('master.getAllBranchMaster', payload);
    }

    //    {
    //       "id": 0,
    //       "PageNo": 1,
    //       "PageSize": 1000,
    //       "Search": ""
    //     }   


    createUpdateBranch(payload: any) {
        this.call('master.createUpdateBranchMaster', payload);
    }

    // {
    //     "command": "master.createUpdateBranchMaster",
    //     "body": {
    //       "id": 0, // 0 for insert, or branch ID for update
    //       "branch_name": "Main Branch",
    //   "address": "123 Main Street, Business Park",
    //   "city": "1",
    //   "state": "West Bengal",
    //   "pin_code": "700001",
    //   "gst": "22AAAAA0000A1Z5",
    //   "pan": "ABCDE1234F",
    //   "phone": "+91-9876543210",
    //   "email": "mainbranch@example.com",
    //   "short_name": "MAIN",
    //   "smtp_host": "smtp.mailserver.com",
    //   "smtp_username": "smtpuser",
    //   "smtp_password": "smtppassword",
    //   "smtp_email": "no-reply@example.com",
    //   "smtp_port": 587,
    //   "smtp_ssl": true, // true if SSL enabled
    //   "wp_token": "whatsapp-api-token",
    //   "sms_username": "smsuser",
    //   "sms_password": "smspassword",
    //   "sms_sender": "SMSALERT",
    //   "footer": "Thank you for choosing our service."
    //     }   
    // }

    deleteBranch(id: number) {
        this.call('master.deleteBranchMaster', { id });
    }


    protected handleMessage(msg: any): boolean {
        return false;
    }
}
