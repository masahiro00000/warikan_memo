import { Injectable } from "@angular/core";
import { IPayment, IRecode, IUpdateDAO } from "./warikan030.d";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class Warikan030Service {
  constructor(private http: HttpClient) {}

  url_insert =
    "https://11dg6drcxd.execute-api.ap-northeast-1.amazonaws.com/warikan/insert";

  url_fetch =
    "https://11dg6drcxd.execute-api.ap-northeast-1.amazonaws.com/warikan/fetch";

  url_update =
    "https://11dg6drcxd.execute-api.ap-northeast-1.amazonaws.com/warikan/update";

  insertRecode(
    key: string,
    groupName: string,
    members: string[],
    payments: IPayment[],
    version: number,
    deleteFlag: boolean
  ) {
    let body: IRecode = {
      key: key,
      groupName: groupName,
      members: members,
      payments: payments,
      creationDatetime: null,
      updateDatetime: null,
      deleteFlag: false,
      version: version,
    };

    return this.http.post(this.url_insert, body, httpOptions);
  }

  fetchRecode(key: string) {
    let body = {
      key: key,
    };
    return this.http.post(this.url_fetch, body, httpOptions);
  }

  updateRecode(
    key: string,
    groupName: string,
    members: string[],
    payments: IPayment[],
    deleteFlag: boolean,
    version: number
  ) {
    let body: IUpdateDAO = {
      key: key,
      groupName: groupName,
      members: members,
      payments: payments,
      deleteFlag: false,
      version: version,
    };

    return this.http.post(this.url_update, body, httpOptions);
  }
}
