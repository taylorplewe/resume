import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PageParent } from '../page-parent';

@Component({
  selector: 'app-page-contact',
  templateUrl: './page-contact.component.html',
  styleUrls: ['./page-contact.component.less']
})
export class PageContactComponent extends PageParent implements AfterViewInit {
  @ViewChild("headerRef") headerRef : ElementRef;
  @ViewChild("bodyRef") bodyRef: ElementRef;

  constructor() { super(); }

  ngAfterViewInit() {
    this.closeAnim(false);
  }

  openAnim() : void {
    setTimeout(() => {
      this.headerRef.nativeElement.children[0].style.opacity = 1;
      this.headerRef.nativeElement.children[0].style.marginBottom = "0px";

      setTimeout(() => {
        this.bodyRef.nativeElement.firstChild.style.marginTop = "0px";
        this.bodyRef.nativeElement.lastChild.style.marginBottom = "0px";
        for (let childEl of this.bodyRef.nativeElement.children) {
          childEl.style.opacity = 1;
        }
      }, this.timeoutLength * this.animAppearOffset);
    }, this.initialBufferLength);
    
  }

  closeAnim(closing : boolean) : void {
    this.headerRef.nativeElement.children[0].style.opacity = 0;
    if (!closing) {
      this.headerRef.nativeElement.children[0].style.marginBottom = "-" + this.animDisplaceDist + "px";
      this.bodyRef.nativeElement.firstChild.style.marginTop = this.animDisplaceDist + "px";
      this.bodyRef.nativeElement.lastChild.style.marginBottom = "-" + this.animDisplaceDist + "px";
    }
    for (let childEl of this.bodyRef.nativeElement.children) {
      childEl.style.opacity = 0;
    }
  }

  // I'm bringing these over from the Me page, I assume I'll need them when I put an image on this page
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
