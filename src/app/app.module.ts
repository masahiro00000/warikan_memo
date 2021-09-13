import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import {
  AppComponent,
  SnackbarComponent,
  QRCodeComponent,
} from "./app.component";
import {
  Warikan000Component,
  warikan000ConfirmDialogComponent,
} from "./warikan000/warikan000.component";
import {
  Warikan010Component,
  warikan010PaymentConfirmDialogComponent,
  warikan010MemberConfirmDialogComponent,
} from "./warikan010/warikan010.component";

import { MatButtonModule, MatCheckboxModule } from "@angular/material";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HttpClientModule } from "@angular/common/http";

import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { Warikan030Component } from "./warikan030/warikan030.component";
import { QRCodeModule } from "angularx-qrcode";

@NgModule({
  declarations: [
    AppComponent,
    Warikan000Component,
    Warikan010Component,
    SnackbarComponent,
    warikan000ConfirmDialogComponent,
    warikan010PaymentConfirmDialogComponent,
    warikan010MemberConfirmDialogComponent,
    Warikan030Component,
    QRCodeComponent,
  ],
  entryComponents: [
    SnackbarComponent,
    warikan000ConfirmDialogComponent,
    warikan010PaymentConfirmDialogComponent,
    warikan010MemberConfirmDialogComponent,
    QRCodeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
