import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PageParent } from '../page-parent'
import { JSDocTagName } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-page-me',
  templateUrl: './page-me.component.html',
  styleUrls: ['./page-me.component.less']
})
export class PageMeComponent extends PageParent implements AfterViewInit {
  animMarginTopSizeLXL = 204; // Pixels; these are VERY temporary
  animMarginTopSizeSM = 140; // ↑
  displayLargeHeader = true; // ↑
  @ViewChild("headerRef") headerRef : ElementRef;
  @ViewChild("bodyRef") bodyRef: ElementRef;

  textFromBackend = ""; // A little paragraph that comes aaaaall the way from my MongoDB database, showing that I know some backend

  constructor() {
    super();
    //this.pageContent = this.pageContent["me"]; // Get contents of page from parent page class
  }

  ngAfterViewInit() {
    this.closeAnim(false);
    setTimeout(() => {this.openAnim()}, this.initialBufferLength);
  }

  openAnim() : void {
    setTimeout(() => {
      this.bodyRef.nativeElement.style.marginTop = "0px";
      this.bodyRef.nativeElement.style.borderWidth = "0px";

      setTimeout(() => {this.showAll(this.bodyRef.nativeElement)}, this.timeoutLength)}
    , this.initialBufferLength);
  }

  closeAnim(closing : boolean) : void {
    this.hideAll(this.bodyRef.nativeElement);

    if (closing) {
      setTimeout(() => {
        this.bodyRef.nativeElement.style.marginTop =
          this.displayLargeHeader ? "-" + this.animMarginTopSizeLXL + "px" : "-" + this.animMarginTopSizeSM + "px";
        this.bodyRef.nativeElement.style.borderWidth = 
          this.displayLargeHeader ? this.animMarginTopSizeLXL + "px" : this.animMarginTopSizeSM + "px"},
        this.timeoutLength);
    } else {
      this.bodyRef.nativeElement.style.marginTop =
        this.displayLargeHeader ? "-" + this.animMarginTopSizeLXL + "px" : "-" + this.animMarginTopSizeSM + "px";
      this.bodyRef.nativeElement.style.borderWidth = 
        this.displayLargeHeader ? this.animMarginTopSizeLXL + "px" : this.animMarginTopSizeSM + "px"
    }
  }

  hideAll(el : any) : void {
    for (let childEl of el.children) {
      if (childEl.className != "blackout") childEl.style.opacity = 0;
      this.hideAll(childEl);
    }
  }

  showAll(el : any) : void {
    for (let childEl of el.children) {
      if (childEl.className != "blackout") childEl.style.opacity = 1;
      this.showAll(childEl);
    }
  }

}
