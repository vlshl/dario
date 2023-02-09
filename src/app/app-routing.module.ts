import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestConfigListComponent } from './components/test-config/test-config-list.component';
import { TestConfigComponent } from './components/test-config/test-config.component';
import { TickSourceListComponent } from './components/tick-source/tick-source-list.component';
import { TickSourceComponent } from './components/tick-source/tick-source.component';
import { LogonComponent } from './components/logon/logon.component';
import { AuthGuard } from './helpers/auth.guard';
import { OpenPosListComponent } from './components/position/open-pos-list.component';
import { ClosePosListComponent } from './components/position/close-pos-list.component';
import { LeechComponent } from './components/leech/leech.component';
import { ChartComponent } from './components/chart/chart.component';


const routes: Routes = [
  { path: 'logon', component: LogonComponent },
  { path: 'test-config-list', component: TestConfigListComponent, canActivate: [AuthGuard] },
  { path: 'test-config', component: TestConfigComponent, canActivate: [AuthGuard] },
  { path: 'tick-source-list', component: TickSourceListComponent, canActivate: [AuthGuard] },
  { path: 'tick-source', component: TickSourceComponent, canActivate: [AuthGuard] },
  { path: 'leech', component: LeechComponent, canActivate: [AuthGuard] },
  { path: 'open-pos-list', component: OpenPosListComponent, canActivate: [AuthGuard] },
  { path: 'close-pos-list', component: ClosePosListComponent, canActivate: [AuthGuard] },
  { path: 'chart', component: ChartComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
