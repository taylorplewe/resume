import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less']
})
export class SidenavComponent implements OnInit {

  @Output() onNavigate = new EventEmitter();
  @Input() selectedTab : string;

  sideNavTabs = [
    {title: "Me", icon: "fas fa-user", highlighted: false, selected: true},
    {title: "Experience", icon: "fas fa-hammer", highlighted: false, selected: false},
    {title: "Contact", icon: "fas fa-envelope-open-text", highlighted: false, selected: false}];

  constructor() { }

  ngOnInit(): void {
    this.selectTab(this.selectedTab);
  }

  navigate(page : string) {
    this.selectTab(page);
    this.onNavigate.emit({ page : page });
  }

  selectTab(page : string) {
    this.sideNavTabs.forEach((tab) => {
      if (tab.title == page) tab.selected = true;
      else tab.selected = false;
    });
  }

}
