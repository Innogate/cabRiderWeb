import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class generalSalebillService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }


  createGeneralSalebill(payload: any) {
    this.call('entry.createGeneralSaleBill', payload);
//  {
//       "company_id": 1,
//       "BranchID": 10,
//       "CityID": 22,
//       "InvNo": "INV-2025-001",
//       "InvDate": "2025-09-10",
//       "DueDate": "2025-09-25",
//       "PartyID": 77,
//       "InvType": "CASH",
//       "TaxType": "GST",
//       "RCM": false,
//       "GrossAmt": 5000,
//       "DiscPer": 5,
//       "DiscAmt": 250,
//       "CGSTPer": 9,
//       "CGSTAmt": 428,
//       "SGSTPer": 9,
//       "SGSTAmt": 428,
//       "IGSTPer": 0,
//       "IGSTAmt": 0,
//       "RndOffAmt": -1,
//       "NetAmt": 5605,
//       "UserID": 101,
//       "EntryDate": "2025-09-10T12:15:00Z",
//       "AmtAdjusted": 0,
//      "transactions": [
//   {
//     "Description": "Product A",
//     "UnitName": "PCS",
//     "Qty": 10,
//     "Rate": 100,
//     "Amt": 1000  },
//   {
//     "Description": "Product B",
//     "UnitName": "PCS",
//     "Qty": 20,
//     "Rate": 200,
//     "Amt": 4000
//   }
// ]

//   }
  }


  protected handleMessage(msg: any): boolean {
    return false;
  }
}
