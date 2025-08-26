import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class companyMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllCompany(payload: any) {
    this.call('master.getAllCompanyMaster', payload);
  }

  createUpdateCompany(payload: any) {
    this.call('master.createUpdateCompanyMaster', payload);
  }

  deleteCompany(id: number) {
    this.call('master.deleteCompanyMaster', {id});
  }

  //   "body": {
  //   "Id": 141,
  //   "companyName": "Test Company Pvt Ltd bbb ghjj hh bb  gh",
  //   "companyAddress": "123 Business Street, Mumbai, MH, 401",
  //   "companyPhone": "9876543210",
  //   "companyEmail": "info@testcompany.com",
  //   "companyWebsite": "https://testcompany.com",
  //   "companyCity": "Mumbai",
  //   "companyGSTNo": "27ABCDE1234F1Z5",
  //   "companyPANNo": "ABCDE1234F",
  //   "companyCGST": "9",
  //   "companySGST": "9",
  //   "companyIGST": "18",
  //   "companyCINNo": "U12345MH2025PTC000001",
  //   "HSNCode": "998599",
  //   "companyBenificaryName": "Test Company Pvt Ltd",
  //   "companyBankAccountNo": "123456789012",
  //   "companyBankAddress": "ICICI Bank, Fort Branch, Mumbai",
  //   "companyBankName": "ICICI Bank",
  //   "companyBankIFSC": "ICIC0000001",
  //   "Tally_CGSTAcName": "CGST Account",
  //   "Tally_SGSTAcName": "SGST Account",
  //   "Tally_IGSTAcName": "IGST Account",
  //   "Tally_RndOffAcName": "Rounding Off",
  //   "Tally_CarRentSaleAc": "Car Rent Sales",
  //   "Tally_CarRentPurchaseAc": "Car Rent Purchase",
  //   "Tally_SaleVouchType": "Sales",
  //   "Tally_PurVouchType": "Purchase"
  // }



  //   Delete(payload: any){
  //     this.post('/master/deleteCharges', payload);
  //   }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
