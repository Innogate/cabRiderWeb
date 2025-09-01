import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})

export class JournalEntryService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getJournal(payload: any){
    this.call('entry.getAllJournal', payload);
  }

  
  createJournal(payload: any){
    this.call('entry.createJournalEntry', payload);
  }

//   {
//   "seletedCompany": 1001,
//   "branchId": 10,
//   "vouchNo": "JV-2025-0001",
//   "vouchDate": "2025-08-20T00:00:00",
//   "narr": "Being payment made towards supplier invoice",
//   "totalDebitAmt": 1000.00,
//   "totalCreditAmt": 1000.00,
//   "amtAdjusted": 0.00,
//   "cancelYN": "N",
//   "cancelBy": null,
//   "cancelOn": null,
//   "cancelReason": null,
//   "user_id": 1,
//    "transactions": [
//     {
//       "ledgerType": "DR",
//       "partyId": 101,
//       "debitAmt": 1000.00,
//       "creditAmt": 0.00
//     },
//     {
//       "ledgerType": "CR",
//       "partyId": 202,
//       "debitAmt": 0.00,
//       "creditAmt": 1000.00
//     }
//   ]
// }


  protected handleMessage(msg: any): boolean {
    return false;
  }
}
