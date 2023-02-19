import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LogonComponent } from './components/logon/logon.component';
import { TestConfigListComponent } from './components/test-config/test-config-list.component';
import { TestConfigComponent } from './components/test-config/test-config.component';
import { TickSourceComponent } from './components/tick-source/tick-source.component';
import { TickSourceListComponent } from './components/tick-source/tick-source-list.component';
import { OpenPosListComponent } from './components/position/open-pos-list.component';
import { ClosePosListComponent } from './components/position/close-pos-list.component';
import { LeechComponent } from './components/leech/leech.component';
import { ChartComponent } from './components/chart/chart.component';
import { InstrumListComponent } from './components/instrum-list/instrum-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LogonComponent,
    TestConfigListComponent,
    TestConfigComponent,
    TickSourceComponent,
    TickSourceListComponent,
    OpenPosListComponent,
    ClosePosListComponent,
    LeechComponent,
    ChartComponent,
    InstrumListComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
