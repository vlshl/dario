import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Instrum } from 'src/app/common/instrum';
import { InstrumService } from 'src/app/services/instrum.service';

@Component({
  selector: 'app-instrum-list',
  templateUrl: './instrum-list.component.html',
  styleUrls: ['./instrum-list.component.scss']
})
export class InstrumListComponent implements OnInit {

  items: Instrum[] = [];

  isFav: boolean = false;
  isActive: boolean = true;
  
  constructor(private instrumSvc: InstrumService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.items = this.instrumSvc.getInstrumList(this.isFav, this.isActive);
  }

  onFilter() {
    this.refreshList();
  }

   isFavInstrum(insId: number) {
     return this.instrumSvc.isFavInstrum(insId);
   }

  isActiveInstrum(insId: number) {
    return this.instrumSvc.isActiveInstrum(insId);
  }

  onFavClick(insId: number, checked: boolean) {
    if (checked) {
      this.instrumSvc.addFavInstrum(insId);
    } else {
      this.instrumSvc.removeFavInstrum(insId);
    }
  }
}
