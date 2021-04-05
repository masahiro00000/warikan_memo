import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  defaultTitle = "割り勘メモ";
  title = this.defaultTitle;
  durationInSeconds = 5;

  /**
   * router-outletにより呼び出されたComponentへの参照
   */
  private componentRef;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  copyUrl() {
    this.copyText(window.location.href);
    this.openSnackBar();
  }

  shareUrl() {
    let newVariable: any;

    newVariable = window.navigator;

    if (newVariable && newVariable.share) {
      newVariable
        .share({
          title: document.querySelector("title").textContent,
          text: document
            .querySelector('meta[name="description"]')
            .getAttribute("content"),
          url: location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("share not supported");
    }
  }
  /* To copy any Text */
  copyText(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  navigate(page: string) {
    this.router.navigate([page], { relativeTo: this.activatedRoute });
  }

  /**
   * router-outletによる画面切り替え時に呼び出される処理
   */
  onActivate(event) {
    // eventを通じて呼び出されたComponentを取得できる
    this.componentRef = event;
    // this.componentRef.anyFunction();

    // console.log("onActivate-------------------------------------------------");
    // console.log("groupName: " + this.componentRef.groupName);
    if (this.componentRef.sendGroupName) {
      this.componentRef.sendGroupName.subscribe((groupName) => {
        this.title = groupName;
      });
    } else {
      this.title = this.defaultTitle;
    }
  }
}

@Component({
  selector: "snack-bar-component-example-snack",
  template: `
    <span class="example-pizza-party">
      URLをコピーしました。
    </span>
  `,
  styles: [
    `
      .example-pizza-party {
      }
    `,
  ],
})
export class SnackbarComponent {}
