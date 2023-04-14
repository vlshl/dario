import { Component, OnInit } from '@angular/core';
import { PxPluginInfo } from 'src/app/common/px-plugin';
import { PluginService } from 'src/app/services/plugin.service';

@Component({
  selector: 'app-plugin-man',
  templateUrl: './plugin-man.component.html',
  styleUrls: ['./plugin-man.component.scss']
})
export class PluginManComponent implements OnInit {

  constructor(private pluginSvc: PluginService) { }

  items: PxPluginInfo[] = [];

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.pluginSvc.getList().subscribe(r => {
      this.items = r;
    });
  }

  loadPlugin(key: string) {
    this.pluginSvc.load(key).subscribe(r => {
      if (r) this.refreshList(); else alert("error");
    });
  }

  unloadPlugin(key: string) {
    this.pluginSvc.unload(key).subscribe(r => {
      if (r) this.refreshList(); else alert("error");
    });
  }

  loadAllPlugins() {
    this.pluginSvc.loadAll().subscribe(r => {
      this.refreshList();
    });
  }

  unloadAllPlugins() {
    this.pluginSvc.unloadAll().subscribe(r => {
      this.refreshList();
    });
  }
}
