import {
  Component,
  OnInit,
  DoCheck,
  ElementRef,
  ViewChild,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { IPayment, IRecode, IRemovemMmberDialogData } from "./warikan010.d";
import { Warikan010Service } from "./warikan010.service";
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
  selector: "app-warikan010",
  templateUrl: "./warikan010.component.html",
  styleUrls: ["./warikan010.component.scss"],
  providers: [Warikan010Service],
})
export class Warikan010Component implements OnInit, DoCheck {
  groupName: string;
  members: string[];
  payments: IPayment[];
  private _paymentsForDisplay: IPayment[];

  amount: number;
  payer: string;
  debtors: string[] = [];
  memo: string;

  selectedTab: number;

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

  @ViewChild("debtorInput", { static: false }) debtorInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  @Output() sendGroupName: EventEmitter<any> = new EventEmitter();

  constructor(
    private warikan010Service: Warikan010Service,
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

  get paymentsForDisplay() {
    this._paymentsForDisplay = [];
    for (let p of this.payments) {
      if (p.id && p.deleteFlag == false) {
        this._paymentsForDisplay.push(p);
      } else if (p.id == null || p.id == undefined) {
        this._paymentsForDisplay.push(p);
      }
    }
    return this._paymentsForDisplay;
  }

  //FIXME-----------------

  ngOnInit() {
    this.groupName = sessionStorage.getItem("groupName");
    this.members = [];
    this.payments = [];
    this._paymentsForDisplay = [];
    this.amount = null;
    this.payer = "";
    this.memo = "";
    this.sumCostsMap = {};
    this.debtsMap = {};
    this.payoffTable = [];
    this.accessKey = this.activatedRoute.snapshot.queryParamMap.get("key");
    if (this.activatedRoute.snapshot.queryParamMap.get("selectedTab")) {
      this.selectedTab = Number(
        this.activatedRoute.snapshot.queryParamMap.get("selectedTab")
      );
    } else {
      this.selectedTab = 0;
    }
    console.log(this.accessKey);
    if (this.accessKey) {
      this.fetchRecode(this.accessKey);
    } else {
      this.sendGroupName.emit(this.groupName);
    }
    this.saveAccessedGroupLog();

    this.amountIconColor = "black";
    this.payerIconColor = "black";
    this.debtorsIconColor = "black";
    this.memoIconColor = "black";
  }

  ngDoCheck() {}

  addMember() {
    if (
      this.nameFormControl.value &&
      !this.members.includes(this.nameFormControl.value)
    ) {
      this.members.push(this.nameFormControl.value);
      this.nameFormControl.reset();
      this.debtors = JSON.parse(JSON.stringify(this.members));
      this.calculateCostPerPerson();
      this.payOff();
      if (this.accessKey) {
        this.updateRecode();
      } else {
        this.insertRecode();
      }
    }
  }

  removeMember(name: string) {
    // TODO: validation check (isRemovable)
    let isDeletable = true;
    for (let payment of this.payments) {
      if (payment.deleteFlag === false) {
        for (let member of payment.debtors) {
          if (member === name) {
            isDeletable = false;
            break;
          }
        }
        if (payment.payer === name) {
          isDeletable = false;
          break;
        }
      }
    }

    if (isDeletable) {
      this.members = this.members.filter(function (item) {
        return item !== name;
      });
      this.debtors = JSON.parse(JSON.stringify(this.members));
      this.updateRecode();
    }
  }

  calculate() {
    this.totalCost = 0;
    for (let p of this.payments) {
      this.totalCost += p.amount;
    }

    this.calculateCostPerPerson();
    this.payOff();
  }

  addPayment() {
    if (this.amount && this.payer) {
      let maxId = 0;
      for (let p of this.payments) {
        if (maxId < p.id) {
          maxId = p.id;
        }
      }
      let payment: IPayment = {
        id: maxId + 1,
        amount: this.amount,
        payer: this.payer,
        debtors: JSON.parse(JSON.stringify(this.debtors)),
        memo: this.memo,
        deleteFlag: false,
      };
      this.payments.push(payment);

      this.calculate();

      if (this.accessKey) {
        this.updateRecode();
      } else {
        this.insertRecode();
      }

      this.amount = null;
      this.payer = null;
      this.debtors = JSON.parse(JSON.stringify(this.members));
      this.memo = null;
      this.amountFC.reset();
    }
  }

  removePayment(payment: IPayment) {
    // TODO: validation check (isRemovable)

    if (payment.id == null || payment.id == undefined) {
      // deleteFlag,idを導入前のデータ用
      this.payments = this.payments.filter(function (item) {
        return item !== payment;
      });
    } else {
      // deleteFlag,idを導入後のデータ用
      for (let p of this.payments) {
        if (payment.id == p.id) {
          p.deleteFlag = true;
        }
      }
    }
    console.log(this.payments);
    // this.debtors = JSON.parse(JSON.stringify(this.members));

    this.calculate();
    this.updateRecode();
  }

  calculateCostPerPerson() {
    if (this.members.length > 0) {
      this.fraction = this.totalCost % this.members.length;
      this.costPerPerson =
        (this.totalCost - this.fraction) / this.members.length;
    }
  }

  payOff() {
    let realDebtsMap: { [key: string]: number } = {};
    for (let person of this.members) {
      this.sumCostsMap[person] = 0;
      this.debtsMap[person] = 0;
      realDebtsMap[person] = 0;
    }

    let fraction: number = 0;
    let sumFraction: number = 0;
    for (let payment of this.paymentsForDisplay) {
      fraction = payment.amount % payment.debtors.length;
      sumFraction += fraction;
      for (let debtor of payment.debtors) {
        realDebtsMap[debtor] += payment.amount / payment.debtors.length;
        this.debtsMap[debtor] +=
          (payment.amount - fraction) / payment.debtors.length;
      }
      realDebtsMap[payment.payer] -= payment.amount;
      this.debtsMap[payment.payer] -= payment.amount;
    }

    for (let i = 0; i < sumFraction; i++) {
      let max: [string, number] = ["", 0];
      for (let person of this.members) {
        if (max[1] < realDebtsMap[person] - this.debtsMap[person]) {
          max[1] = realDebtsMap[person] - this.debtsMap[person];
          max[0] = person;
        }
      }
      this.debtsMap[max[0]] += 1;
    }

    this.payoffTable = [];
    let tmpMap = JSON.parse(JSON.stringify(this.debtsMap));
    for (let i = 0; i < this.members.length; i++) {
      for (let p1 of this.members) {
        for (let p2 of this.members) {
          if (p1 != p2) {
            if (tmpMap[p1] > 0 && tmpMap[p2] < 0) {
              if (Math.abs(tmpMap[p1]) <= Math.abs(tmpMap[p2])) {
                this.payoffTable.push({
                  source: p1,
                  dist: p2,
                  amount: tmpMap[p1],
                });
                tmpMap[p2] += tmpMap[p1];
                tmpMap[p1] = 0;
              } else {
                this.payoffTable.push({
                  source: p1,
                  dist: p2,
                  amount: Math.abs(tmpMap[p2]),
                });
                tmpMap[p1] += tmpMap[p2];
                tmpMap[p2] = 0;
              }
            }
          }
          // this.debtsMap[person] = this.costForEach - this.sumCostsMap[person];
        }
      }
    }
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

  insertRecode() {
    let key = this.getRndStr();
    // sessionStorage.setItem("groupName", this.groupName);
    this.version = 0;
    this.warikan010Service
      .insertRecode(
        key,
        this.groupName,
        this.members,
        this.payments,
        this.version,
        false
      )
      .subscribe((data) => {
        console.log(JSON.stringify(data));
        this.accessKey = key;
        this.saveAccessedGroupLog();
        this.router.navigate(["/items"], { queryParams: { key: key } });
      });
  }

  fetchRecode(key: string) {
    this.warikan010Service.fetchRecode(key).subscribe((data) => {
      this.fetchedRecode = {
        key: data["key"],
        groupName: data["groupName"],
        members: data["members"],
        payments: data["payments"],
        creationDatetime: data["creationDatetime"],
        updateDatetime: data["updateDatetime"],
        deleteFlag: data["deleteFlag"],
        version: data["version"],
      };
      this.groupName = this.fetchedRecode.groupName;
      this.saveAccessedGroupLog();
      this.members = this.fetchedRecode.members;
      this.payments = this.fetchedRecode.payments;
      this.version = this.fetchedRecode.version;
      this.payOff();
      this.debtors = JSON.parse(JSON.stringify(this.members));

      this.sendGroupName.emit(this.groupName);

      console.log(JSON.stringify(data));
    });
  }

  updateRecode() {
    this.warikan010Service
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
            window.alert("エラー");
            window.location.reload(true);
          } else {
            this.version = Number(data["Attributes"]["version"]);
          }
        },
        (err) => {
          this.fetchRecode(this.accessKey);
          console.log(JSON.stringify(err));
        },
        () => {}
      );
  }

  getRndStr() {
    //使用文字の定義
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    //桁数の定義
    let len = 8;

    //ランダムな文字列の生成
    let result = "";
    for (let i = 0; i < len; i++) {
      result += str.charAt(Math.floor(Math.random() * str.length));
    }
    return result;
  }

  saveAccessedGroupLog() {
    console.log("saveGroupLog");
    console.log("key: " + this.accessKey);
    console.log("groupname: " + this.groupName);
    if (this.accessKey) {
      // this.fetchRecode(this.accessKey);
      let accessedGroupLog = localStorage.getItem("accessedGroupLog");
      if (accessedGroupLog) {
        let tmpMap: { key: string; groupName: string }[] = JSON.parse(
          accessedGroupLog
        );
        let exists = false;
        let i;
        tmpMap.forEach((item, index) => {
          if (item.key === this.accessKey) {
            exists = true;
            i = index;
          }
        });

        console.log("exists: " + String(exists));
        console.log("i: " + String(i));

        if (exists) {
          tmpMap.splice(i, 1);
        }
        tmpMap.unshift({ key: this.accessKey, groupName: this.groupName });
        localStorage.setItem("accessedGroupLog", JSON.stringify(tmpMap));
      } else {
        let tmpMap: { key: string; groupName: string }[] = [];
        tmpMap.unshift({ key: this.accessKey, groupName: this.groupName });
        localStorage.setItem("accessedGroupLog", JSON.stringify(tmpMap));
      }
    }
  }

  openRemovePaymentDialog(e, payment: IPayment): void {
    console.log("removePayment");
    e.stopPropagation();
    const dialogRef = this.dialog.open(
      warikan010PaymentConfirmDialogComponent,
      {
        width: "400px",
        data: payment,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        this.removePayment(payment);
      }
    });
  }

  openRemoveMemberDialog(member: string): void {
    let isRemovable = true;
    for (let payment of this.payments) {
      if (payment.deleteFlag === false) {
        if (payment.payer === member) {
          isRemovable = false;
          break;
        }
        for (let debtor of payment.debtors) {
          if (debtor === member) {
            isRemovable = false;
            break;
          }
        }
      }
    }

    let data: IRemovemMmberDialogData = {
      isRemovable: isRemovable,
      member: member,
    };

    const dialogRef = this.dialog.open(warikan010MemberConfirmDialogComponent, {
      width: "400px",
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        this.removeMember(member);
      }
    });
  }

  navigate(payment: IPayment) {
    console.log("navigate");
    sessionStorage.setItem("accessKey", this.accessKey);
    sessionStorage.setItem("groupName", this.groupName);
    sessionStorage.setItem("members", JSON.stringify(this.members));
    sessionStorage.setItem("payment", JSON.stringify(payment));
    sessionStorage.setItem("payments", JSON.stringify(this.payments));
    sessionStorage.setItem("version", this.version.toString());
    this.router.navigate(["/paymentDetail"]);
  }
}

@Component({
  selector: "confirm-payment-dialog",
  templateUrl: "paymentDialog.html",
  styleUrls: ["./warikan010.component.scss"],
})
export class warikan010PaymentConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<warikan010PaymentConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPayment
  ) {}
}

@Component({
  selector: "confirm-member-dialog",
  templateUrl: "memberDialog.html",
  styleUrls: ["./warikan010.component.scss"],
})
export class warikan010MemberConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<warikan010MemberConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRemovemMmberDialogData
  ) {}
}
