import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { guestMasterService } from '../../../services/guestMaster.service';
import { commonService } from '../../../services/comonApi.service';
import { globalRequestHandler } from '../../../utils/global';

@Component({
  selector: 'app-company-master',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DynamicTableComponent],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.css'
})
export class CompanyMasterComponent implements OnInit,OnDestroy,AfterViewInit {
  
  showForm: boolean= false;
  isLoading: boolean= true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string='';
  form!: FormGroup;
  partyname: any[] = [];
  tablevalue: any;
   constructor(
    private guestlistMasterService: guestMasterService, 
    private router: Router,
    private messageService: MessageService,
    private comonApiService: commonService,
    private fb: FormBuilder
    
  ){
      this.createForm();
    }

    createForm(){
      this.form = this.fb.group({
         active: ['Y'],
         id: [0],
      })
    }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.guestlistMasterService.registerPageHandler((msg) => {
       console.log(msg);
        globalRequestHandler(msg, this.router, this.messageService);
        if (msg.for === "getAllCompany") {
          this.isLoading = false
          this.data = msg.data
        } 
        return true;
      });
  }
        // Define the columns for the dynamic table

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Company Name', field: 'party_name', icon: 'pi pi-building', styleClass: 'text-red-600' },
    { header: 'Company Address', field: 'GuestName', icon: 'pi pi-map-marker', styleClass: 'text-green-600' },
    { header: 'Contact No', field: 'ContactNo', icon: 'pi pi-phone' },
    { header: 'Short Name', field: 'AddrType', icon: 'pi pi-tag', styleClass: 'text-lime-600' },
    { header: 'Email', field: 'EmailID', icon: 'pi pi-envelope', styleClass: 'text-yellow-600' },
    { header: 'Website', field: 'Address', icon: 'pi pi-globe', styleClass: 'text-green-600' },    
    { header: 'City', field: 'AditionalContactNo', icon: 'pi pi-map', styleClass: 'text-indigo-700' },
  ];

  actions = [
    { icon: 'pi pi-pencil', action: 'edit', styleClass: 'p-button-warning' },
    { icon: 'pi pi-trash', action: 'delete', styleClass: 'p-button-danger' }
  ];
  handleAction(event: { action: string, data: any }) {
    switch (event.action) {
      case 'edit':
        this.showForm = true;
        this.isEditMode = true;
        this.heading = 'UPDATE COMPANY';
        console.log("edit");
        const  partyname = this.partyname.find(partyname =>partyname.Id == event.data.party_name);
        this.form.patchValue({
          ...event.data,
          party_name: partyname
        })
        break;
      case 'delete':
        console.log("delete")
        break;
      case 'add':
        this.showForm = true;
        this.heading = 'ADD COMPANY';
        this.isEditMode = false;
        console.log("add");
        this.form.reset();
      break;
    }
  }

}
