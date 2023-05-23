import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/services/position.service';
import { InstrumService } from 'src/app/services/instrum.service';
import { LeechService } from 'src/app/services/leech.service';
import { ClosePosItem } from 'src/app/common/close-pos-item';

@Component({
  selector: 'app-close-pos-list',
  templateUrl: './close-pos-list.component.html',
  styleUrls: ['./close-pos-list.component.scss']
})
export class ClosePosListComponent implements OnInit {

  items: ClosePosItem[] = [];

  constructor(private posSvc: PositionService, private insSvc: InstrumService, private leechSvc: LeechService) { }

  ngOnInit(): void {
    this.posSvc.getClosePos().subscribe(res => {
      this.items = res.map(p => new ClosePosItem(this.insSvc, p));
      this.items.sort((a, b) => new Date(a.closeTime!).getTime() - new Date(b.closeTime!).getTime());
    }, err => {
      console.log(err);
    });
  }
}
