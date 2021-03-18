import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { IPayment, IRecode } from "./warikan030.d";
import { Warikan030Service } from "./warikan030.service";
import { FormControl, Validators } from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-warikan030",
  templateUrl: "./warikan030.component.html",
  styleUrls: ["./warikan030.component.scss"],
})
export class Warikan030Component implements OnInit {
  groupName: string;
  members: string[];
  payment: IPayment;
  payments: IPayment[];

  amount: number;
  payer: string;
  memo: string;

  amountFC: FormControl = new FormControl("", [Validators.required]);

  totalCost: number;
  costPerPerson: number;
  fraction: number;
  sumCostsMap: { [key: string]: number };
  debtsMap: { [key: string]: number };

  payoffTable: { source: string; dist: string; amount: number }[];

  nameFormControl = new FormControl("", [
    // Validators.required
  ]);

  fetchedRecode: IRecode;
  private queryParams: any;
  private accessKey: string;
  version: number;

  amountIconColor: string;
  payerIconColor: string;
  debtorsIconColor: string;
  memoIconColor: string;

  // FIXME----------------
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  debtorCtrl = new FormControl();
  filtereddebtors: Observable<string[]>;
  debtors: string[] = [];

  @ViewChild("debtorInput", { static: false }) debtorInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  @Output() sendGroupName: EventEmitter<any> = new EventEmitter();

  constructor(
    private warikan020Service: Warikan030Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.filtereddebtors = this.debtorCtrl.valueChanges.pipe(
      startWith(null),
      map((debtor: string | null) =>
        debtor ? this._filter(debtor) : this.members.slice()
      )
    );
  }
  //FIXME-----------------

  ngOnInit() {
    this.accessKey = sessionStorage.getItem("accessKey");
    this.groupName = sessionStorage.getItem("groupName");
    this.members = JSON.parse(sessionStorage.getItem("members"));
    this.payment = JSON.parse(sessionStorage.getItem("payment"));
    this.payments = JSON.parse(sessionStorage.getItem("payments"));
    this.version = Number(sessionStorage.getItem("version"));
    this.amount = this.payment.amount;
    this.payer = this.payment.payer;
    this.debtors = JSON.parse(JSON.stringify(this.payment.debtors));
    this.memo = this.payment.memo;
    this.sumCostsMap = {};
    this.debtsMap = {};
    this.payoffTable = [];
    this.sendGroupName.emit(this.groupName);

    this.amountIconColor = "black";
    this.payerIconColor = "black";
    this.debtorsIconColor = "black";
    this.memoIconColor = "black";
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }

  updatePayment() {
    let target;
    this.payments.forEach((payment, index) => {
      if (this.isEqualPayment(payment, this.payment)) {
        target = index;
      }
    });

    console.log("aaaa");
    if (target !== undefined) {
      this.payments[target].amount = this.amount;
      this.payments[target].debtors = this.debtors;
      this.payments[target].memo = this.memo;
      this.payments[target].payer = this.payer;
      this.updateRecode();
    }
  }

  isEqualPayment(p1: IPayment, p2: IPayment) {
    let res: boolean;
    if (p1.id == p2.id) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  // FIXME--------------------------------------------------------------------
  add(event: MatChipInputEvent): void {
    // Add debtor only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our debtor
      if ((value || "").trim()) {
        if (
          !this.debtors.includes(value.trim()) &&
          this.members.includes(value.trim())
        ) {
          this.debtors.push(value.trim());
        }
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.debtorCtrl.setValue(null);
    }
  }

  remove(debtor: string): void {
    const index = this.debtors.indexOf(debtor);

    if (index >= 0) {
      this.debtors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.debtors.includes(event.option.viewValue)) {
      this.debtors.push(event.option.viewValue);
    }
    this.debtorInput.nativeElement.value = "";
    this.debtorCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.members.filter(
      (debtor) => debtor.toLowerCase().indexOf(filterValue) === 0
    );
  }
  // FIXME-----------------------------------------------------

  updateRecode() {
    this.warikan020Service
      .updateRecode(
        this.accessKey,
        this.groupName,
        this.members,
        this.payments,
        false,
        this.version
      )
      .subscribe(
        (data) => {
          console.log(JSON.stringify(data));
          if (data["errorMsg"]) {
            window.alert("排他制御エラー");
            window.location.reload(true);
          } else {
            this.version = Number(data["Attributes"]["version"]);
            this.router.navigate(["/items"], {
              queryParams: { key: this.accessKey, selectedTab: 1 },
            });
          }
        },
        (err) => {
          window.alert("排他制御エラー");
          console.log(JSON.stringify(err));
        },
        () => {}
      );
  }

  navigate(key: string) {
    console.log("navigate");
    this.router.navigate(["/items"], { queryParams: { key: key } });
  }

  back() {
    this.router.navigate(["/items"], {
      queryParams: { key: this.accessKey, selectedTab: 1 },
    });
  }
}
