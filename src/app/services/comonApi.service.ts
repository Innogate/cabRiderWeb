import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class commonService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllCityDropDown(payload: any) {
    this.call('common.gatAllCityDropDown', payload);
  }


  // universal delete
  deleteData(payload: any) {
    this.call('common.deleteData', payload);
  }


  GatAllDriverDropDown(payload: any) {
    this.call('common.gatAllDriverDropDown', payload);
  }

  GatAllBranchDropDown(payload: any) {
    this.call('common.gatAllBranchDropDown', payload);
  }

  gateAllPartyNameDropdown() {
    this.call('common.getAllPartyNameDropdown', {});
  }


  getAllPartyNameByCity(payload: any){
    this.call('common.getAllPartyRateByCity', payload)
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
