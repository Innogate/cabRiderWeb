import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { branchMasterService } from '../../../services/branchMaster.Service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { globalRequestHandler } from '../../../utils/global';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { AutoComplete } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-branch-master',
  imports: [CommonModule,ReactiveFormsModule,InputTextModule,DynamicTableComponent,DropdownModule,AutoComplete,CheckboxModule],
  templateUrl: './branch-master.component.html',
  styleUrl: './branch-master.component.css'
})

export class BranchMasterComponent implements OnInit,OnDestroy,AfterViewInit {
  
  showForm: boolean= false;
  isLoading: boolean= true;
  isEditMode: boolean = false;
  data: any[] = [];
  heading: string='';
  form!: FormGroup;
  partyname: any[] = [];
  tablevalue: any;

  constructor(
    private BranchMasterService: branchMasterService, 
    private router: Router,
    private messageService: MessageService,
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
    const payload = {
      id: 0,
      PageNo: 1,
      PageSize: 1000,
      Search: "",
    };
    this.BranchMasterService.getAllbranch(payload);
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.BranchMasterService.registerPageHandler((msg) => {
       console.log(msg);
        globalRequestHandler(msg, this.router, this.messageService);
        if (msg.for === "getAllBranch") {
          this.isLoading = false
          this.data = msg.data
        } 
        return true;
      });
  }
        // Define the columns for the dynamic table


  columns = [
    { header: 'ID', field: 'id' },
    { header: 'BRANCH NAME', field: 'branch_name', icon: 'pi pi-building-columns', styleClass: 'text-red-900' },
    { header: 'WALLET AMOUNT', field: 'Wallet', icon: 'pi pi-wallet', styleClass: 'text-red-800' },
    { header: 'CITY NAME', field: 'city', icon: 'pi pi-map-marker', styleClass: 'text-red-800' },
    { header: 'STATE NAME', field: 'state', icon: 'pi pi-map', styleClass: 'text-red-800' },
    { header: 'STATE CODE', field: 'state', icon: 'pi pi-envelope', styleClass: 'text-red-800' },    
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
        this.heading = 'UPDATE BRANCH';
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
        this.heading = 'ADD BRANCH';
        this.isEditMode = false;
        console.log("add");
        this.form.reset();
      break;
    }
  }

}

