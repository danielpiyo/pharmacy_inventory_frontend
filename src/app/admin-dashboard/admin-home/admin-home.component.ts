import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'src/app/_service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  mode: string ;
  currentUserToken: any;
  model: any; 
  loading = false;
 
  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,    
    private router: Router
  ) {
   
    }

  ngOnInit() {
   
  }

 

}
