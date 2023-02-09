import { Component, OnInit } from '@angular/core';
import { LeechService } from 'src/app/services/leech.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-leech',
  templateUrl: './leech.component.html',
  styleUrls: ['./leech.component.css']
})
export class LeechComponent implements OnInit {

  ident = '';
  state = '';

  constructor(private leechSvc: LeechService, private posSvc: PositionService) { }

  ngOnInit(): void {
    this.leechSvc.getIdentity().subscribe(r => {
      this.ident = r;
    }, err => {
      console.log(err);
    });
  }

  fullsync() {
    this.state = 'Полная синхронизация ...';
    this.leechSvc.fullsync().subscribe(r => {
      this.state = 'Синхронизация завершена';
    }, err => {
      this.state = 'Ошибка синхронизации';
      console.log(err);
    });
  }

  sync() {
    this.state = 'Синхронизация ...';
    this.leechSvc.sync().subscribe(r => {
      this.state = 'Синхронизация завершена';
    }, err => {
      this.state = 'Ошибка синхронизации';
      console.log(err);
    });
  }

  clearPos() {
    this.state = 'Очистка позиций ...';
    this.posSvc.clearPos().subscribe(r => {
      this.state = 'Очистка завершена';
    }, err => {
      this.state = 'Ошибка при очистке';
      console.log(err);
    });
  }

  refreshPos() {
    this.state = 'Обновление позиций ...';
    this.posSvc.refreshPos().subscribe(r => {
      this.state = 'Обновление завершено';
    }, err => {
      this.state = 'Ошибка обновления';
      console.log(err);
    });
  }

}
