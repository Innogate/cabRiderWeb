import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { globalRequestHandler } from '../../utils/global';
import { carTypeMasterService } from '../../services/carTypeMaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { commonService } from '../../services/comonApi.service';
import { MinvoiceService } from '../../services/minvoice.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-mbilling',
  imports: [
    FormsModule,
    RadioButtonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    RippleModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    CalendarModule,
    BadgeModule,
  ],
  templateUrl: './mbilling.component.html',
  styleUrl: './mbilling.component.css',
})
export class MbillingComponent {
  constructor(
    private carTypeMaster: carTypeMasterService,
    private router: Router,
    private messageService: MessageService,
    private commonApiService: commonService,
    private cdr: ChangeDetectorRef,
    private _minvoice: MinvoiceService,
    private _helperService: HelperService
  ) { }
  @Input() sleetedBookingIds?: any[];

  // Column 1
  fixedAmount: any;
  extraHours: any;
  extrakm: any;
  exceptDayHrs: any;
  extraDaykm: any;
  fuelAmount: any;
  Sgst: any;

  // Column 2
  numDays: any;
  rate1: any;
  rate2: any;
  rate3: any;
  rate4: any;
  mobileAmount: any;
  Cgst: any;

  // Column 3
  Amount: any;
  extaHAmount: any;
  billTotal2: any;
  amount3: any;
  amount2: any;
  desc2: string = '';
  igst: any;
  isParkingTaxApplied: boolean = false;

  // Column 4
  billTotal: any;
  advance: any;
  serviceTax: any;
  eduCess: any;
  sbCess: any;
  roundOff: any;
  amountPayable: any;

  // Extra
  desc: string = '';


  // added
  totalKm: number = 0;
  totalHours: number = 0;
  showTotalHour: any = 0;
  showTotalKm: any = 0;

  totalPaybleAmaunt: any = 0;
  totalPaybleGSTAmount: any = 0;

  totalPaybleSGSTAmount: any = 0;
  totalPaybleCGSTAmount: any = 0;
  totalPaybleIGSTAmount: any = 0;

  aboveAdvance: any = 0;
  otherCharges: { taxable: any[], nonTaxable: any[] } = { taxable: [], nonTaxable: [] };
  taxableSumCharges: number = 0;
  nonTaxableSumCharges: number = 0;

  ngOnInit(): void {
    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'minvoice.getMonthlySetupCode') {
          this.monthlySetupData = msg.data;
        }
        else if (msg.for === 'getOtherChargesForBookingList') {
          this.otherCharges.taxable = msg.data.taxable;
          // sum Amount of taxable charges
          this.taxableSumCharges = this.otherCharges.taxable.reduce((total: number, charge: any) => total + charge.total_amount, 0);
          this.otherCharges.nonTaxable = msg.data.nonTaxable;
          // sum Amount of non taxable charges
          this.nonTaxableSumCharges = this.otherCharges.nonTaxable.reduce((total: number, charge: any) => total + charge.total_amount, 0);
          console.log(this.otherCharges)
          rt = true
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });
    this.Cgst = this.partyInfo.CGST;
    this.Sgst = this.partyInfo.SGST;
    this.igst = this.partyInfo.IGST;
    console.log(this.partyInfo);
    this.getAllMonthlySetupCode();
  }

  @Input() selectedDuties: any[] = [];
  @Input() mainDutyList: any[] = [];
  @Input() invoiceForm!: FormGroup;
  @Input() taxType: any;
  @Input() partyInfo:any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mainDutyList']) {
    }
    if (changes['selectedDuties']) {
    }
    if (changes['sleetedBookingIds']) {
      this.sleetedBookingIds = changes['sleetedBookingIds'].currentValue;
      this.getOtherChargesById()

    }
    if (changes['taxType']) {
      this.taxType = changes['taxType'].currentValue;
    }
    if (changes['partyInfo']) {
      this.partyInfo = changes['partyInfo'].currentValue;
      this.Sgst = this.partyInfo.SGST;
      this.Cgst = this.partyInfo.CGST;
      this.igst = this.partyInfo.IGST;
      this.calNetAmount();
    }
  }

  monthlySetupData: any[] = [];

  totalSelectedDays: number = 0;
  totalSelectedKm: number = 0;
  totalCalculatedAmount: number = 0;
  totalTimeText: string = '';
  extraHour: number = 0;
  totalExtraHour: number = 0;
  totalextraKmRate: number = 0;
  totalextraHourAmount: number = 0;
  salary: number = 0;
  totalextraHourRate: number = 0;

  // DODO
  selectedMonthlyDuty?: any;
  isCalculated: boolean = false;


  // AutoComplete
  filteredCodes: any[] = [];
  selectedCode: any[] = [];

  filterCodes(event: any) {
    const query = event.query?.toLowerCase() || '';
    if (!this.monthlySetupData || !Array.isArray(this.monthlySetupData)) {
      this.filteredCodes = [];
      return;
    }
    this.filteredCodes = this.monthlySetupData.filter((codeObj) =>
      codeObj.DutyNo?.toLowerCase().includes(query)
    );
  }

  // API CALLS

  getAllMonthlySetupCode() {
    this.commonApiService.getMonthlySetupCode({});
  }

  calculateTotals(selected: any[]) {
    const setupCode = this.invoiceForm.get('SetupCode')?.value;

    if (!setupCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Setup Code',
        detail: 'Please select Duty Setup Code before calculating.',
      });
      return;
    }

    let totalDays = 0;
    let totalAmount = 0;
    let totalMinutes = 0;
    let groseAmount = 0;
    let extraHourRate = 0;
    let extraKmRate = 0;
    this.extraHour = 0;
    let totalKm = 0;

    const setup = this.monthlySetupData?.find((s: any) => s.id === setupCode);
    this.selectedMonthlyDuty = setup;

    if (!setup) {
      this.messageService.add({
        severity: 'error',
        summary: 'Setup Code Not Found',
        detail: 'Selected Setup Code not found in Monthly Setup Data.',
      });
      return;
    }

    const seenDateRanges = new Set<string>(); // Track already processed date pairs

    // ** CALCULATE ALL Table Row
    selected.forEach((item: any) => {
      const fromDate = new Date(item.fromDate);
      const toDate = new Date(item.toDate);
      //  Day calculation
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        const dateKey = `${fromDate.toDateString()}_${toDate.toDateString()}`;

        if (!seenDateRanges.has(dateKey)) {
          seenDateRanges.add(dateKey); // Mark as seen

          const diffTime = toDate.getTime() - fromDate.getTime();
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

          totalDays += days;

          const dutyAmt = setup?.DutyAmt ?? 0;
          const amount = Number(((dutyAmt / 30) * days).toFixed(2));
          totalAmount += amount;
          groseAmount = dutyAmt;

          const extraDayHrsRate = setup?.OTRate ?? 0;
          extraHourRate = extraDayHrsRate;



          const km = Number(item.TotalKm) || 0;
          totalKm += km;

          //! Time calculation
          const workStartTimeDate = this.getDbTimeString(setup.FromTime);
          const workEndTimeDate = this.getDbTimeString(setup.ToTime);

          if (item.GarageOutTime && item.GarageInDate) {
            let diffTime = this.calculateExtraHours(
              item.GarageOutDate,
              item.GarageInDate,
              workStartTimeDate,
              workEndTimeDate
            )
            this.totalExtraHour += diffTime;
          }

          // total Hour calculation
        } else {
          //! Time calculation
          const workStartTimeDate = this.getDbTimeString(setup.FromTime);
          const workEndTimeDate = this.getDbTimeString(setup.ToTime);

          if (item.GarageOutTime && item.GarageInDate) {
            let diffTime = this.calculateExtraHours(
              item.GarageOutDate,
              item.GarageInDate,
              workStartTimeDate,
              workEndTimeDate
            )
            this.totalExtraHour += diffTime;
          }
          console.log(`Duplicate date found: ${dateKey}, skipping day count`);
        }
        this.showTotalHour += item.TotalHour;
        this.showTotalKm += item.TotalKm;

      }

      const extraKMRate = setup?.ExtraDayKMRate ?? 0;
      extraKmRate = extraKMRate;

      // ** Final Calculation
      if (totalKm > setup.TotalKm) {
        totalKm = totalKm - setup.TotalKm;
      }
      else {
        totalKm = 0;
      }
    });

    // 📊 Final calculations
    const totalHoursDecimal = totalMinutes / 60;
    this.totalTimeText = `${totalHoursDecimal.toFixed(2)} hrs`;
    // 🕒 Time Check using FromTime and ToTime
    if (setup?.FromTime && setup?.ToTime) {
      const fromTime = new Date(setup.FromTime);
      const toTime = new Date(setup.ToTime);

      if (isNaN(fromTime.getTime()) || isNaN(toTime.getTime())) {
        return;
      }

      const fromDate = new Date();
      const toDate = new Date();

      fromDate.setHours(fromTime.getHours(), fromTime.getMinutes(), 0, 0);
      toDate.setHours(toTime.getHours(), toTime.getMinutes(), 0, 0);

      // Handle overnight shift (e.g. 8 PM to 6 AM next day)
      if (toDate < fromDate) {
        toDate.setDate(toDate.getDate() + 1);
      }

      const diffMs = toDate.getTime() - fromDate.getTime();
      const totalhrs = diffMs / (1000 * 60 * 60); // in hours

      const totalHoursDecimal = this.totalTimeText
        ? parseFloat(this.totalTimeText)
        : 0;

      if (totalHoursDecimal > totalhrs) {
        this.extraHour = Number((totalHoursDecimal - totalhrs).toFixed(2));
      }
    }

    //  Set to UI-bound variables
    this.totalSelectedDays = totalDays;
    this.totalCalculatedAmount = totalAmount;
    this.salary = groseAmount;
    this.totalextraHourRate = extraHourRate
    this.totalextraKmRate = extraKmRate;
    this.totalSelectedKm = totalKm; //  Store for use elsewhere

    console.log('Total selected kilometers:', totalKm);
    console.log('Total Time:', this.totalTimeText);
    console.log('Total Days:', totalDays);
    console.log('Total Amount:', totalAmount);
    console.log('Extra Hour:', this.extraHour);
  }

  calculateExtraHours(
    startDateInput: Date | string,
    endDateInput: Date | string,
    workStartTime: string, // "08:00"
    workEndTime: string    // "20:00"
  ): number {
    // Convert to Date objects if strings are passed
    const startDate = new Date(startDateInput);
    let endDate = new Date(endDateInput);

    // Helper: set a time on the same date as a reference date
    const setTime = (baseDate: Date, timeStr: string): Date => {
      const [h, m] = timeStr.split(":").map(Number);
      const d = new Date(baseDate);
      d.setHours(h, m, 0, 0);
      return d;
    };

    // Handle overnight shifts (end next day)
    if (endDate <= startDate) {
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const workStart = setTime(startDate, workStartTime);
    const workEnd = setTime(startDate, workEndTime);

    let extraHours = 0;

    // Entire shift outside duty hours → whole time is overtime
    if (endDate <= workStart || startDate >= workEnd) {
      extraHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    } else {
      // Before start time
      if (startDate < workStart) {
        extraHours += (workStart.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      }
      // After end time
      if (endDate > workEnd) {
        extraHours += (endDate.getTime() - workEnd.getTime()) / (1000 * 60 * 60);
      }
    }

    extraHours = parseFloat(extraHours.toFixed(2));

    // Logging
    console.log(
      `Start Date: ${startDate.toISOString()}\n` +
      `End Date: ${endDate.toISOString()}\n` +
      `Work Start Time: ${workStartTime}\n` +
      `Work End Time: ${workEndTime}\n` +
      `Total Extra Hours: ${extraHours}\n`
    );

    return extraHours;
  }




  calculateBillAndLog() {
    if (this.isCalculated) {
      return;
    }
    this.isCalculated = true;
    this.calculateTotals(this.mainDutyList);

    // Auto-fill some fields with example values (for demo/testing)
    this.fixedAmount = this.salary;
    this.extraHours = this.totalExtraHour;
    this.extrakm = this.totalSelectedKm;
    this.numDays = this.totalSelectedDays;
    this.Amount = this.totalCalculatedAmount;

    this.rate1 = this.totalextraHourRate;
    this.extaHAmount = this.totalextraHourRate * this.totalExtraHour;

    this.rate2 = this.totalextraKmRate;
    this.billTotal2 = this.extrakm * this.rate2;

    this.totalPaybleAmaunt = (this.Amount + this.extaHAmount + this.totalextraKmRate)
    this.calNetAmount();
  }

  getBillingFormData() {
    return {
      // Column 1
      fixedAmount: this.fixedAmount,
      extraHours: this.totalExtraHour,
      extrakm: this.extrakm,
      exceptDayHrs: this.exceptDayHrs,
      extraDaykm: this.extraDaykm,
      fuelAmount: this.fuelAmount,

      // Column 2
      numDays: this.numDays,
      rate1: this.rate1,
      rate2: this.rate2,
      rate3: this.rate3,
      rate4: this.rate4,
      mobileAmount: this.mobileAmount,

      // Column 3
      fixedAmount2: this.Amount,
      extaHAmount: this.extaHAmount,
      billTotal2: this.billTotal2,
      amount3: this.amount3,
      amount2: this.amount2,
      desc2: this.desc2,
      isParkingTaxApplied: this.isParkingTaxApplied,

      // Column 4
      billTotal: this.billTotal,
      advance: this.advance,
      serviceTax: this.serviceTax,
      eduCess: this.eduCess,
      sbCess: this.sbCess,
      roundOff: this.roundOff,
      amountPayable: this.amountPayable,

      // Extra
      desc: this.desc,
    };
  }

  logBillingFormValues() {
    const payload = {
      ...this.getBillingFormData(),
      id: this.mainDutyList.map((d) => d.id),
    };

    this._minvoice.createMonthlyBilling(payload);
  }


  getDbTimeString(dateValue: string | Date): string {
    const date = (typeof dateValue === "string") ? new Date(dateValue) : dateValue;
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  calculateIGST() {
    let igstPercentage = Number(this.igst);
    let amount = this.totalPaybleAmaunt;
    // Check if IGST percentage is provided
    if (igstPercentage > 0) {
      const igstAmount = (amount * (igstPercentage/100));
      this.totalPaybleIGSTAmount = igstAmount.toFixed(2);
    } else {
      this.totalPaybleIGSTAmount = 0; // If no IGST percentage provided, return 0
    }
  }

  calculateCGST() {
    let cgstPercentage = Number(this.Cgst);
    let amount = this.totalPaybleAmaunt;
    // Check if CGST percentage is provided
    if (cgstPercentage > 0) {
      const cgstAmount = (amount * (cgstPercentage/100));
      this.totalPaybleCGSTAmount = cgstAmount.toFixed(2);
    } else {
      this.totalPaybleCGSTAmount = 0; // If no CGST percentage provided, return 0
    }
  }

  calculateSGST() {
    let sgstPercentage = Number(this.Sgst);
    let amount = (this.totalPaybleAmaunt + this.taxableSumCharges);
    // Check if SGST percentage is provided
    if (sgstPercentage > 0) {
      const sgstAmount = (amount * (sgstPercentage/100));
      this.totalPaybleSGSTAmount = sgstAmount.toFixed(2);
    } else {
      this.totalPaybleSGSTAmount = 0; // If no SGST percentage provided, return 0
    }
  }

async calNetAmount() {
  // Ensure all variables involved in calculation are numbers
  this.calculateGST(); // Assuming this method ensures numbers are set

  // Ensure all the values are numbers and not strings
  const totalPaybleCGSTAmount = Number(this.totalPaybleCGSTAmount);
  const totalPaybleSGSTAmount = Number(this.totalPaybleSGSTAmount);
  const totalPaybleAmaunt = Number(this.totalPaybleAmaunt);
  const nonTaxableSumCharges = Number(this.nonTaxableSumCharges);
  const taxableSumCharges = Number(this.taxableSumCharges);
  const totalPaybleIGSTAmount = Number(this.totalPaybleIGSTAmount);
  const aboveAdvance = Number(this.aboveAdvance);

  // Perform the calculation based on the taxType
  if (this.taxType === 'cgst') {
    // Calculate total for CGST
    this.totalPaybleGSTAmount = totalPaybleCGSTAmount + totalPaybleSGSTAmount + totalPaybleAmaunt + nonTaxableSumCharges + taxableSumCharges;
  } else {
    // Calculate total for IGST
    this.totalPaybleGSTAmount = totalPaybleIGSTAmount + totalPaybleAmaunt + nonTaxableSumCharges + taxableSumCharges;
  }

  console.log('Calculated Total Payable GST Amount:', this.totalPaybleGSTAmount);

  // Round off the totalPaybleGSTAmount
  this.roundOff = await this.roundOffValue(this.totalPaybleGSTAmount);
  console.log('Rounded off value:', this.roundOff);

  // Final net amount calculation after subtracting the advance amount
  this.totalPaybleGSTAmount = this.roundOff - aboveAdvance;

  console.log('Final Total Payable GST Amount:', this.totalPaybleGSTAmount);
}


  getOtherChargesById() {
    if (this.sleetedBookingIds && this.sleetedBookingIds.length > 0) {
      this._helperService.getOtherChargesForBookingList(this.sleetedBookingIds)
    }
  }



  roundOffValue(value: number): number {
    if (value % 1 < 0.5) {
      return Math.floor(value);  // Round down if less than 0.5
    } else {
      return Math.ceil(value);   // Round up if greater or equal to 0.5
    }
  }

  calculateGST(){
    if (this.taxType == 'cgst') {
      this.calculateCGST();
      this.calculateSGST();
    }
    else{
      this.calculateIGST();
    }
  }


}
