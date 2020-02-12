import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { UserToken } from 'src/app/_model/user';
import { NewExpences } from 'src/app/_model/expences.model';
import { Subscription } from 'rxjs';
import { ExpencesService } from 'src/app/_service/expences.service';
import { AlertService } from 'src/app/_service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

export interface Expences {
  expence_id: number;
  expence_name: string;
  expence_amount: string;
  details: string;
}

@Component({
  selector: 'app-admin-expences',
  templateUrl: './admin-expences.component.html',
  styleUrls: ['./admin-expences.component.css']
})
export class AdminExpencesComponent implements OnInit {
  userToken: UserToken = new UserToken();
  allExpences: [];
  expencesSubscription: Subscription;


  public displayedColumns = ['number', 'Name', 'Amount', 'details', 'edit', 'delete'];

  public dataSource = new MatTableDataSource<Expences>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(private expencesService: ExpencesService, private alertService: AlertService, private dialog: MatDialog) {
    this.userToken.token = JSON.parse(localStorage.getItem('currentToken'));
   }

  ngOnInit() {
    this.getAllExpences();
  }


  // get All expences
  getAllExpences() {
    this.expencesSubscription = this.expencesService.getAllExpences(this.userToken)
      .subscribe((res: []) => {
        this.allExpences = res;
        this.dataSource.data = this.allExpences as Expences[];
      }, error => {
        console.log(error);
      });
  }

  // add new expence
  addNew() {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(AdminNewExpencesModal, {width: '50%'});
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.expencesSubscription) {
      this.expencesSubscription.unsubscribe();
    }
  }
}

// adding new expences
// child component
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-expences-modal',
  templateUrl: 'admin-expences.modal.component.html',
  styleUrls: ['./admin-expences.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class AdminNewExpencesModal {
  expenceModel: NewExpences = new NewExpences();
  currentToken: UserToken = new UserToken();

  constructor(
    public dialogRef: MatDialogRef<AdminNewExpencesModal>,
    private expencesService: ExpencesService,
    private router: Router,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentToken.token = JSON.parse(localStorage.getItem('currentToken'));
  }


  submit() {
    this.expenceModel.token = this.currentToken.token;
    this.expencesService.postExpence(this.expenceModel)
      .subscribe((response) => {
        this.alertService.success('You have Succesfully posted Expences');
        this.onNoClick();
        this.router.navigate(['/admin/expences']);
      }, error => {
        this.alertService.error(error.message);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
