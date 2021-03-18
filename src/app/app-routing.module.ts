import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Warikan000Component } from "./warikan000/warikan000.component";
import { Warikan010Component } from "./warikan010/warikan010.component";
import { Warikan030Component } from "./warikan030/warikan030.component";

const routes: Routes = [
  { path: "", component: Warikan000Component },
  { path: "items", component: Warikan010Component },
  { path: "paymentDetail", component: Warikan030Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
