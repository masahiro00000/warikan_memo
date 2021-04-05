import { Component, OnInit, DoCheck, Inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { NgModule } from "@angular/core";
// import { BrowserModule } from "@angular/platform-browser";
// import { FormsModule } from "@angular/forms";

export interface DialogData {
  key: string;
  groupName: string;
}

@Component({
  selector: "app-warikan000",
  templateUrl: "./warikan000.component.html",
  styleUrls: ["./warikan000.component.scss"],
})
export class Warikan000Component implements OnInit {
  accessKey: string;
  link: string;
  groupName: string;
  accessedGroupLog: { key: string; groupName: string }[];
  defaultGroupName = "割り勘メモ";

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.accessKey = "";
    this.groupName = "";
    this.getAccessedGroupLog();
    // sessionStorage.removeItem("groupName");
  }

  saveGroupName() {
    sessionStorage.setItem(
      "groupName",
      this.groupName ? this.groupName : this.defaultGroupName
    );

    // if (this.groupName.trim()) {
    //   sessionStorage.setItem(
    //     "groupName",
    //     this.groupName == "" ? this.defaultGroupName : this.groupName
    //   );
    // } else {
    //   sessionStorage.removeItem("groupName");
    // }
  }

  getAccessedGroupLog() {
    this.accessedGroupLog = JSON.parse(
      localStorage.getItem("accessedGroupLog")
    );
    // console.log(this.accessedGroupLog);
  }

  removeAccessedGroupLog(i: number) {
    // console.log("remove");
    this.accessedGroupLog.splice(i, 1);
    localStorage.setItem(
      "accessedGroupLog",
      JSON.stringify(this.accessedGroupLog)
    );
  }

  navigate(key: string) {
    // console.log("navigate");
    this.router.navigate(["/items"], {
      queryParams: { key: key, selectedTab: 0 },
    });
  }

  openDialog(event, i: number): void {
    // 親要素にクリックイベントが伝搬されるのを防ぐ
    event.stopPropagation();

    const dialogRef = this.dialog.open(warikan000ConfirmDialogComponent, {
      width: "300px",
      data: this.accessedGroupLog[i],
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log("The dialog was closed");
      if (result) {
        this.removeAccessedGroupLog(i);
      }
    });
  }
}

@Component({
  selector: "confirm-dialog",
  templateUrl: "dialog.html",
})
export class warikan000ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<warikan000ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
