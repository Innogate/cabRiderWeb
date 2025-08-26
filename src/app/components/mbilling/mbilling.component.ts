import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() selectedDuties: any[] = [];
  @Input() mainDutyList: any[] = [];
  @Input() dutyTableData: any[] = [];
  @Input() invoiceForm!: FormGroup;
  @Input() taxType: any;
  @Input() partyInfo: any;
  @Input() isCalculated: any;
  @Input() calCulateData: any;
  @Input() selectedMontySetupCode: any;
  @Input() isEditMode: boolean = false;
  @Input() carTypes: any[] = [];

  @Output() dutyUpdated = new EventEmitter<{
    dutyTableData: any[];
    mainDutyList: any[];
    sleetedBookingIds: any[];
  }>();

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
  totalKmAmount: any;
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
  otherCharges: { taxable: any[]; nonTaxable: any[] } = {
    taxable: [],
    nonTaxable: [],
  };
  taxableSumCharges: number = 0;
  nonTaxableSumCharges: number = 0;

  dutyTypes = [
    { label: 'DISPOSAL', value: '1' },
    { label: 'OUTSTATION', value: '2' },
    { label: 'PICKUP', value: '3' },
    { label: 'DROP', value: '4' },
  ];

  ngOnInit(): void {
    this.carTypeMaster.registerPageHandler((msg) => {
      let rt = false;
      rt = globalRequestHandler(msg, this.router, this.messageService);
      if (msg.for) {
        if (msg.for === 'CarTypeGate') {
          this.carTypes = msg.data;
          rt = true;
        }
        else if (msg.for === 'getOtherChargesForBookingList') {
          this.otherCharges.taxable = msg.data.taxable;
          // sum Amount of taxable charges
          this.taxableSumCharges = this.otherCharges.taxable.reduce(
            (total: number, charge: any) => total + charge.total_amount,
            0
          );
          this.otherCharges.nonTaxable = msg.data.nonTaxable;
          // sum Amount of non taxable charges
          this.nonTaxableSumCharges = this.otherCharges.nonTaxable.reduce(
            (total: number, charge: any) => total + charge.total_amount,
            0
          );
          rt = true;
        }
        if (msg.for === 'createMonthlyBilling') {
          this.router.navigate(['/monthly-invoice']);
          rt = true;
        }
      }
      if (rt == false) {
        console.log(msg);
      }
      return rt;
    });
    if (this.isCalculated) {
      this.setInvoiceData(this.calCulateData)
    }

    console.log(this.mainDutyList)
    this.Cgst = this.partyInfo.CGST;
    this.Sgst = this.partyInfo.SGST;
    this.igst = this.partyInfo.IGST;

  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['mainDutyList']) {
      this.mainDutyList = changes['mainDutyList'].currentValue;
      console.log('Main Duty List Updated:', this.mainDutyList);
    }
    if (changes['selectedDuties']) {
      this.selectedDuties = changes['selectedDuties'].currentValue;
    }
    if (changes['sleetedBookingIds']) {
      this.sleetedBookingIds = changes['sleetedBookingIds'].currentValue;
      this.getOtherChargesById();
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
    if (changes['setup_Code']) {
      this.selectedMontySetupCode = changes['setup_Code'].currentValue;
      if (this.invoiceForm) {
        this.invoiceForm
          .get('setup_code')
          ?.setValue(this.selectedMontySetupCode.id ?? null);
      }
    }
    if (changes['isCalculated']) {
      this.isCalculated = changes['isCalculated'].currentValue;
    }
    if (changes['calCulateData']) {
      this.calCulateData = changes['calCulateData'].currentValue;
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

  getDutyTypeName(id: string | number): string {
    const found = this.dutyTypes.find(d => d.value == id);
    return found ? found.label : '';
  }

  getCartypeName(carTypeId: string | number): string {
    const found = this.carTypes.find(c => c.id == carTypeId);
    return found ? found.car_type : '';
  }



  // API CALLS
  async calculateTotals(selected: any[]) {
    console.log(selected);
    const setupCode = this.selectedMontySetupCode;
    console.log(setupCode);
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
    this.totalExtraHour = 0;
    this.extraHour = 0;
    this.showTotalHour = 0;
    this.showTotalKm = 0;

    const setup = this.selectedMontySetupCode;
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
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // month is 0-based
    };

    // ** CALCULATE ALL Table Row
    await selected.forEach(async (item: any) => {
      console.log("---------------------------------------------------");
      console.log(`  Raw StartDate: ${item.StartDate}`);
      console.log(`  Raw EndDate  : ${item.EndDate}`);

      const StartDate = parseDate(item.StartDate);
      const EndDate = parseDate(item.EndDate);

      console.log(`  Parsed StartDate: ${StartDate.toDateString()}`);
      console.log(`  Parsed EndDate  : ${EndDate.toDateString()}`);

      if (!isNaN(StartDate.getTime()) && !isNaN(EndDate.getTime())) {
        const dateKey = `${StartDate.toDateString()}_${EndDate.toDateString()}`;

        if (!seenDateRanges.has(dateKey)) {
          seenDateRanges.add(dateKey);

          const diffTime = EndDate.getTime() - StartDate.getTime();
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

          console.log(`✅ Day Difference: ${days} days`);

          totalDays += days;

          const dutyAmt = setup?.DutyAmt ?? 0;
          const amount = Number(((dutyAmt / 30) * days).toFixed(2));
          totalAmount += amount;
          groseAmount = dutyAmt;

          console.log(`💰 DutyAmt: ${dutyAmt}`);
          console.log(`💰 Amount for this period: ${amount}`);
          console.log(`📊 Running Total Days: ${totalDays}`);
          console.log(`📊 Running Total Amount: ${totalAmount}`);
        }

        const extraDayHrsRate = setup?.OTRate;
        extraHourRate = extraDayHrsRate;
        const workStartTimeDate = this.getDbTimeString(setup.FromTime);
        const workEndTimeDate = this.getDbTimeString(setup.ToTime);

        if (item.GarageOutTime && item.GarageInTime) {
          let diffTime = await this.calculateExtraHours(
            item.GarageOutTime,
            item.GarageInTime,
            workStartTimeDate,
            workEndTimeDate
          );
          this.totalExtraHour += diffTime;
        }

        this.showTotalHour += item.TotalHour;
        this.showTotalKm += item.TotalKm;
      }
    });

    const extraKMRate = setup?.ExtraDayKMRate;
    extraKmRate = extraKMRate;

    // ** Final Calculation
    this.extrakm = 0;
    if (this.showTotalKm > this.selectedMonthlyDuty.TotalKM) {
      this.extrakm = this.showTotalKm - this.selectedMonthlyDuty.TotalKM;
      console.log('Extra KM: ', this.extrakm);
    }

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
    this.totalextraHourRate = extraHourRate;
    this.totalextraKmRate = extraKmRate;
    this.totalSelectedKm = this.showTotalKm;
  }

  calculateExtraHours(
    startDateInput: string,
    endDateInput: string,
    workStartTime: string, // "08:00"
    workEndTime: string    // "20:00"
  ): number {
    console.log("---------------------------------------------------");
    console.log(`📌 Input:`);
    console.log(`  startDateInput: ${startDateInput}`);
    console.log(`  endDateInput:   ${endDateInput}`);
    console.log(`  workStartTime:  ${workStartTime}`);
    console.log(`  workEndTime:    ${workEndTime}`);

    const parseTime = (timeStr: string, referenceDate: Date): Date => {
      const [h, m] = (timeStr ?? "00:00").split(":").map(Number);
      const d = new Date(referenceDate);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const today = new Date();
    const startDate = parseTime(startDateInput, today);
    let endDate = parseTime(endDateInput, today);

    // Overnight shift → push endDate to next day
    if (endDate <= startDate) {
      console.log("⚠️ End time before start time → overnight shift");
      endDate.setDate(endDate.getDate() + 1);
    }

    const workStart = parseTime(workStartTime, startDate);
    const workEnd = parseTime(workEndTime, startDate);

    console.log("---------------------------------------------------");
    console.log("📅 Reference times:");
    console.log(`  Shift Start : ${startDate}`);
    console.log(`  Shift End   : ${endDate}`);
    console.log(`  Work Start  : ${workStart}`);
    console.log(`  Work End    : ${workEnd}`);

    let extraHours = 0;

    if (endDate <= workStart || startDate >= workEnd) {
      extraHours = (endDate.getTime() - startDate.getTime()) / 3600000;
      console.log("✅ Entire shift outside work hours → All overtime");
    } else {
      if (startDate < workStart) {
        const hrs = (workStart.getTime() - startDate.getTime()) / 3600000;
        extraHours += hrs;
        console.log(`✅ Started before work hours → +${hrs.toFixed(2)} hrs`);
      }
      if (endDate > workEnd) {
        const hrs = (endDate.getTime() - workEnd.getTime()) / 3600000;
        extraHours += hrs;
        console.log(`✅ Continued after work hours → +${hrs.toFixed(2)} hrs`);
      }
      const nextWorkStart = parseTime(workStartTime, endDate);
      if (endDate <= nextWorkStart && endDate.getDate() !== startDate.getDate()) {
        const hrs = (nextWorkStart.getTime() - endDate.getTime()) / 3600000;
        extraHours += hrs;
        console.log(`✅ Ended before next day’s work start → +${hrs.toFixed(2)} hrs`);
      }
    }

    extraHours = parseFloat(extraHours.toFixed(2));
    console.log("---------------------------------------------------");
    console.log(`🎯 Final Overtime Hours = ${extraHours} hrs`);
    console.log("---------------------------------------------------");

    return extraHours;
  }




  async calculateBillAndLog() {
    this.totalKmAmount = 0;
    this.totalPaybleAmaunt = 0;
    this.totalPaybleGSTAmount = 0;
    this.totalPaybleCGSTAmount = 0;
    this.totalPaybleSGSTAmount = 0;
    this.totalPaybleIGSTAmount = 0;
    this.roundOff = 0;

    this.isCalculated = false;
    await this.calculateTotals(this.mainDutyList);

    // Auto-fill some fields with example values (for demo/testing)
    this.fixedAmount = this.salary;
    this.extraHours = this.totalExtraHour;
    this.numDays = this.totalSelectedDays;
    this.Amount = this.totalCalculatedAmount.toFixed(2);

    this.rate1 = this.totalextraHourRate;
    this.extaHAmount = this.totalextraHourRate * this.totalExtraHour;

    this.rate2 = this.totalextraKmRate;
    this.totalKmAmount = this.extrakm * this.rate2;

    this.totalPaybleAmaunt =
      Number(this.Amount || 0) +
      Number(this.extaHAmount || 0) +
      Number(this.totalKmAmount || 0);
    this.totalPaybleAmaunt = Number(this.totalPaybleAmaunt.toFixed(2));

    await this.calNetAmount();
    this.isCalculated = true;
  }

  getBillingFormData() {
    return {
      BillDate: this.invoiceForm.get('BillDate')?.value ?? new Date(),
      taxtype: this.invoiceForm.get('taxtype')?.value === 'cgst' ? 1 : 0,
      company_id: this.invoiceForm.get('company_id')?.value,
      branch_id: this.invoiceForm.get('branch_id')?.value,
      city_id: this.invoiceForm.get('city_id')?.value,
      party_id: this.invoiceForm.get('party_id')?.value,

      // Column 1

      fixed_amount: this.fixedAmount,
      extra_hours: this.totalExtraHour,
      extra_km: this.extrakm,
      except_day_hrs: this.exceptDayHrs,
      extra_day_km: this.extraDaykm,
      fuel_amount: this.fuelAmount,

      // Column 2
      no_of_days: this.numDays,
      extra_hours_rate: this.rate1,
      extra_km_rate: this.rate2,
      except_day_hrs_rate: this.rate3,
      except_day_km_rate: this.rate4,
      mobil_amount: this.mobileAmount,

      // Column 3
      fixed_amount_total: this.Amount,
      extra_hours_amount: this.extaHAmount,
      extra_km_amount: this.totalKmAmount,
      except_day_hrs_amount: this.amount3,
      except_day_km_amount: this.amount2,
      remarks: this.desc2,


      // Column 4
      bill_total: this.billTotal,
      Advance: this.aboveAdvance,
      round_off: this.roundOff,
      NetAmount: this.totalPaybleGSTAmount,
      OtherCharges: this.taxableSumCharges,
      SGST: this.totalPaybleSGSTAmount,
      CGST: this.totalPaybleCGSTAmount,
      IGST: this.totalPaybleIGSTAmount,
      OtherCharges2: this.nonTaxableSumCharges,

      IGSTPer: this.igst,
      CGSTPer: this.Cgst,
      SGSTPer: this.Sgst,

      // extra
      rcm: 0,
      Invcancel: null,
      InvcancelOn: null,
      Invcancelby: null,
      InvcancelReason: null,
      GrossAmount: this.totalPaybleAmaunt,
      Discount: 0,
      monthly_duty_id: this.selectedMonthlyDuty.id,
      except_day_km: 0,
      parking_amount: 0,
      night_amount: 0,
      outstation_amount: 0,
      proportionate: 0,
      amount_payable: 0
    };
  }

  logBillingFormValues() {
    const payload = {
      ...this.getBillingFormData(),
      duty_ids: this.mainDutyList.map((d) => d.id),
    };

    this._minvoice.createMonthlyBilling(payload);
  }

  getDbTimeString(dateValue: string | Date): string {
    const date =
      typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  calculateIGST() {
    let igstPercentage = Number(this.igst);
    let amount = this.totalPaybleAmaunt + this.taxableSumCharges;
    // Check if IGST percentage is provided
    if (igstPercentage > 0) {
      const igstAmount = amount * (igstPercentage / 100);
      this.totalPaybleIGSTAmount = igstAmount.toFixed(2);
    } else {
      this.totalPaybleIGSTAmount = 0;
    }
  }

  calculateCGST() {
    let cgstPercentage = Number(this.Cgst);
    let amount = this.totalPaybleAmaunt + this.taxableSumCharges;
    // Check if CGST percentage is provided
    if (cgstPercentage > 0) {
      const cgstAmount = amount * (cgstPercentage / 100);
      this.totalPaybleCGSTAmount = cgstAmount.toFixed(2);
    } else {
      this.totalPaybleCGSTAmount = 0; // If no CGST percentage provided, return 0
    }
  }

  calculateSGST() {
    let sgstPercentage = Number(this.Sgst);
    let amount = this.totalPaybleAmaunt + this.taxableSumCharges;
    // Check if SGST percentage is provided
    if (sgstPercentage > 0) {
      const sgstAmount = amount * (sgstPercentage / 100);
      this.totalPaybleSGSTAmount = sgstAmount.toFixed(2);
    } else {
      this.totalPaybleSGSTAmount = 0; // If no SGST percentage provided, return 0
    }
  }

  async calNetAmount() {
    // Ensure all variables involved in calculation are numbers
    await this.calculateGST(); // Assuming this method ensures numbers are set

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
      this.totalPaybleGSTAmount =
        totalPaybleCGSTAmount +
        totalPaybleSGSTAmount +
        totalPaybleAmaunt +
        nonTaxableSumCharges +
        taxableSumCharges;
    } else {
      // Calculate total for IGST
      this.totalPaybleGSTAmount =
        totalPaybleIGSTAmount +
        totalPaybleAmaunt +
        nonTaxableSumCharges +
        taxableSumCharges;
    }

    // Round off the totalPaybleGSTAmount
    this.roundOff = await Math.abs(
      Math.round(this.totalPaybleGSTAmount) - this.totalPaybleGSTAmount
    ).toFixed(2);

    // Final net amount calculation after subtracting the advance amount
    this.totalPaybleGSTAmount =
      Math.round(this.totalPaybleGSTAmount) - aboveAdvance;
  }

  getOtherChargesById() {
    if (this.sleetedBookingIds && this.sleetedBookingIds.length > 0) {
      this._helperService.getOtherChargesForBookingList(this.sleetedBookingIds);
    }
  }

  roundOffValue(value: number): number {
    if (value % 1 < 0.5) {
      return Math.floor(value); // Round down if less than 0.5
    } else {
      return Math.ceil(value); // Round up if greater or equal to 0.5
    }
  }

  async calculateGST() {
    if (this.taxType == 'cgst') {
      await this.calculateCGST();
      await this.calculateSGST();
    } else {
      this.calculateIGST();
    }
  }

  removeDutyFromInvoice(duty: any) {
    const index = this.mainDutyList.findIndex((d) => d.id === duty.id);

    if (index !== -1) {
      // Remove from mainDutyList
      this.mainDutyList.splice(index, 1);

      // Re-enable in popup
      this.dutyTableData = this.dutyTableData.map((item: any) =>
        item.id === duty.id
          ? { ...item, disabled: false, selected: false }
          : item
      );

      // Remove from selectedBookingIds
      if (this.sleetedBookingIds) {
        this.sleetedBookingIds = this.sleetedBookingIds.filter(
          (id: any) => id !== duty.id
        );
      }

      this.cdr.detectChanges();
      this.calNetAmount();

      // 🔹 Emit updates back to MonthlyCreate
      this.dutyUpdated.emit({
        dutyTableData: this.dutyTableData,
        mainDutyList: this.mainDutyList,
        sleetedBookingIds: this.sleetedBookingIds ?? [],
      });
    } else {
      console.error('Duty not found in mainDutyList:', duty);
    }
  }

  setInvoiceData(data: any) {
    // --- Patch form values ---
    this.invoiceForm.get('BillDate')?.setValue(data.BillDate ?? new Date());
    this.invoiceForm.get('taxtype')?.setValue(data.taxtype === 1 ? 'cgst' : 'igst');
    this.invoiceForm.get('company_id')?.setValue(data.company_id);
    this.invoiceForm.get('branch_id')?.setValue(data.branch_id);
    this.invoiceForm.get('city_id')?.setValue(data.city_id);
    this.invoiceForm.get('party_id')?.setValue(data.party_id);

    // --- Assign component variables ---
    this.fixedAmount = data.fixed_amount;
    this.totalExtraHour = data.extra_hours;
    this.extrakm = data.extra_km;
    this.exceptDayHrs = data.except_day_hrs;
    this.extraDaykm = data.extra_day_km;
    this.fuelAmount = data.fuel_amount;

    this.numDays = data.no_of_days;
    this.rate1 = data.extra_hours_rate;
    this.rate2 = data.extra_km_rate;
    this.rate3 = data.except_day_hrs_rate;
    this.rate4 = data.except_day_km_rate;
    this.mobileAmount = data.mobil_amount;

    this.Amount = data.fixed_amount_total;
    this.extaHAmount = data.extra_hours_amount;
    this.totalKmAmount = data.extra_km_amount;
    this.amount3 = data.except_day_hrs_amount;
    this.amount2 = data.except_day_km_amount;
    this.desc2 = data.remarks;

    this.billTotal = data.bill_total;
    this.aboveAdvance = data.Advance;
    this.roundOff = data.round_off;
    this.totalPaybleGSTAmount = data.NetAmount;
    this.taxableSumCharges = data.OtherCharges;
    this.totalPaybleSGSTAmount = data.SGST;
    this.totalPaybleCGSTAmount = data.CGST;
    this.totalPaybleIGSTAmount = data.IGST;
    this.nonTaxableSumCharges = data.OtherCharges2;

    this.igst = data.IGSTPer;
    this.Cgst = data.CGSTPer;
    this.Sgst = data.SGSTPer;

    this.totalPaybleAmaunt = data.GrossAmount;
    this.selectedMonthlyDuty = { id: data.monthly_duty_id };

    // // extras
    // this.parking_amount = data.parking_amount ?? 0;
    // this.night_amount = data.night_amount ?? 0;
    // this.outstation_amount = data.outstation_amount ?? 0;
    // this.proportionate = data.proportionate ?? 0;
    // this.amount_payable = data.amount_payable ?? 0;
  }
}
