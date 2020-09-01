import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { HandleScroll } from '../handle-scroll';

@Component({
  selector: 'app-pullout-nav',
  templateUrl: './pullout-nav.component.html',
  styleUrls: ['./pullout-nav.component.less']
})
export class PulloutNavComponent implements OnInit, AfterViewInit {

  snapAnimationLength = 300; // Milliseconds
  tabOpenAnimTimout = 1500; // Milliseconds

  // Variables for touch input; they must be declared here so they can be referenced in the touch methods at the bottom of this page
  onDevice : boolean; // I determine if we're on a device by seeing if innerWidth == outerWidth on initialization
  touchCanPull : boolean; // When the user has already swiped up or down on this touch, this becomes false and you can't pull out the pulloutNav until you let go again
  touchHorMoving : boolean; // If the user has already started swiping left or right, touchCanPull must stay true no matter what
  touchStartPos : {x : any, y : any};
  touchCurrPos : {x : any, y : any};
  paneState : string;
  panePosOnTouch : any;
  touchDistThreshold = 15;
  pulloutWidth  = 75; // Percentage of screen width
  maxBlackoutOpacity = 0.5;
  canScroll = true;

  @Output() onNavigate = new EventEmitter();
  @Input() selectedTab : string;

  navTabs = [
    {title: "Me", icon: "fas fa-user", highlighted: false, selected: true},
    {title: "Experience", icon: "fas fa-hammer", highlighted: false, selected: false},
    {title: "Contact", icon: "fas fa-envelope-open-text", highlighted: false, selected: false}];

  constructor() { }

  ngOnInit(): void {
    this.selectTab(this.selectedTab);

    this.onDevice = window.innerWidth == window.outerWidth ? true : false;

    document.addEventListener("touchstart", this.touchStart);
    document.addEventListener("touchmove", this.touchMove);
    document.addEventListener("touchend", this.touchEnd);

    document["onDevice"] = this.onDevice;
    document["touchDistThreshold"] = this.touchDistThreshold;
    document["pulloutWidth"] = this.pulloutWidth;
    document["maxBlackoutOpacity"] = this.maxBlackoutOpacity;
    document["snapAnimationLength"] = this.snapAnimationLength;
    document["canScroll"] = this.canScroll;
  }

  ngAfterViewInit() : void {
    setTimeout(() => {document.getElementById("pullout-tab").style.left = "100%"}, this.tabOpenAnimTimout);
  }

  navigate(page : string) {
    window.scrollTo(0, 0);
    setTimeout(() => {this.togglePullout("close")}, 200);
    this.selectTab(page);
    this.onNavigate.emit({ page : page });
  }

  selectTab(page : string) {
    this.navTabs.forEach((tab) => {
      if (tab.title == page) tab.selected = true;
      else tab.selected = false;
    });
  }

  togglePullout(dir : string) {
    const paneEl = document.getElementById("pullout-pane");
    const blackoutEl = document.getElementById("pullout-blackout");
    paneEl.style.transition = `left ${this.snapAnimationLength / 1000}s ease-out`;
    blackoutEl.style.transition = `opacity ${this.snapAnimationLength / 1000}s ease-out`;
    if (dir == "open") {
      paneEl.style.left = "0px";
      blackoutEl.style.opacity = `${this.maxBlackoutOpacity}`;
      blackoutEl.style.visibility = "initial";

      document["canScroll"] = false;
      HandleScroll.disableScroll();
    } else if (dir == "close") {
      paneEl.style.left = `-${this.pulloutWidth}%`;
      blackoutEl.style.opacity = "0";

      // Make it so you can scroll again
      document["canScroll"] = true;
      HandleScroll.enableScroll();

      // Make the blackout disappear after transition so you can interact with the page behind it again
      setTimeout(() => {blackoutEl.style.visibility = "hidden"}, this.snapAnimationLength);
    }
    document.getElementById("pullout-tab-caret").style.transform =
      dir == "open" ? "rotate(0.5turn)" : "";
    if (dir == "toggle") {
      if (paneEl.style.left == "0px") this.togglePullout("close");
      else this.togglePullout("open");
    }
  }

  // TOUCH INPUT
  // 'this' is #document and not the AppComponenet inside of these events
  touchStart(ev : TouchEvent) {
    document.getElementById("pullout-pane").style.transition = "none";
    document.getElementById("pullout-blackout").style.transition = "none";
    
    this.panePosOnTouch = document.getElementById("pullout-pane").style.left;
    if (this.panePosOnTouch == "") this.panePosOnTouch = -this.pulloutWidth;
    this.panePosOnTouch = parseInt(this.panePosOnTouch);

    if (this.panePosOnTouch > -(this.pulloutWidth/2)) this.paneState = "open";
    else this.paneState = "closed";
    
    this.touchStartPos = {x: ev.touches[0].clientX, y: ev.touches[0].clientY};
    this.touchCurrPos = this.touchStartPos;
    this.touchCanPull = ev.touches.length > 1 ? false :
      !this.onDevice ? true :
      window.innerWidth != window.outerWidth ? false : true; // No interference if user is zoomed in, or doing aything with two fingers
    this.touchHorMoving = false;
  }
  touchMove(ev : TouchEvent) {
    this.touchCurrPos = {x: ev.touches[0].clientX, y: ev.touches[0].clientY};

    // If the user is swiping up or down
    if (Math.abs(this.touchCurrPos.y - this.touchStartPos.y) > this.touchDistThreshold && !this.touchHorMoving) {
        this.touchCanPull = false;
    }
    // If the user is swiping left or right
    if (this.touchHorMoving || (Math.abs(this.touchCurrPos.x - this.touchStartPos.x) > this.touchDistThreshold && this.touchCanPull))
    {
      // In case they open the thing immediately as the page loads, make the little tab go where it's supposed to (w/o animation)
      document.getElementById("pullout-tab").style.transition = "none";
      document.getElementById("pullout-tab").style.left = "100%";
      // TODO: Figure out how to disable page scrolling here
      if (this.canScroll) {
        // Come back to this, it's not working because 'document' doesn't have HandleScroll imported is my guess. I don't know how to do that
        HandleScroll.disableScroll();
        this.canScroll = false;
      }

      document.getElementById("pullout-blackout").style.visibility = "initial";
      this.touchHorMoving = true;
      let percentage = ((this.touchCurrPos.x - this.touchStartPos.x) / window.innerWidth) * 100;
      document.getElementById("pullout-pane").style.left =
        Math.min(
          Math.max(
            this.panePosOnTouch + percentage,
            this.pulloutWidth * -1
          ),
          0
        ) + "%";
      let panePos = parseInt(document.getElementById("pullout-pane").style.left);
      document.getElementById("pullout-blackout").style.opacity =
        (
          (
            (
              100 - (
                (panePos * -1) /* 0 to panePos */ * ( 100 / this.pulloutWidth ) // 0 to 100
              ) // 100 to 0
            ) / 100 // 1 to 0
          ) * this.maxBlackoutOpacity // maxBlackoutOpacity (ex. 0.5) to 0
        ).toString();
    }
  }
  touchEnd(ev : TouchEvent) {
    const paneEl = document.getElementById("pullout-pane");
    const blackoutEl = document.getElementById("pullout-blackout");
    const distOut = parseInt(paneEl.style.left);

    // We only want transitions when the pullout snaps to and fro (after the user lets go), not when we're dragging it
    paneEl.style.transition = "left " + (this.snapAnimationLength / 1000) + "s ease-out";
    blackoutEl.style.transition = "opacity " + (this.snapAnimationLength / 1000) + "s ease-out";

    // Only execute the following if the user had been dragging open or closed the pullout navigation on this touch
    if (this.touchHorMoving) {
      // Snap open or closed when you let go
      let openDistThreshold = 5; // Percentage of screen width
      openDistThreshold = this.paneState == "open" ? openDistThreshold * -1 : (this.pulloutWidth - openDistThreshold) * -1;
      // Open
      if (distOut > openDistThreshold) {
        this.paneState = "open";
        paneEl.style.left = "0px";
        blackoutEl.style.opacity = "0.5";
      }
      // Closed
      else {
        this.paneState = "closed";
        paneEl.style.left = "-" + this.pulloutWidth + "%";
        blackoutEl.style.opacity = "0";

        // Make it so you can scroll again
        this.canScroll = true;
        HandleScroll.enableScroll();

        // Make the blackout disappear after transition so you can interact with the page behind it again
        setTimeout(() => {blackoutEl.style.visibility = "hidden"}, this.snapAnimationLength);
      }
      // Flip the little arrow around as necessary
      document.getElementById("pullout-tab-caret").style.transform =
        this.paneState == "open" ? "rotate(0.5turn)" : "";
    }

    // Close pullout if you tap outside when it's open
    if (ev.target["id"] == "pullout-blackout" &&
        Math.abs(this.touchCurrPos.x - this.touchStartPos.x) < this.touchDistThreshold &&
        Math.abs(this.touchCurrPos.y - this.touchStartPos.y) < this.touchDistThreshold) {
      paneEl.style.left = "-" + this.pulloutWidth + "%";
      blackoutEl.style.opacity = "0";

      // Make it so you can scroll again
      this.canScroll = true;
      HandleScroll.enableScroll();
      
      // Make the blackout disappear after transition so you can interact with the page behind it again
      setTimeout(() => {blackoutEl.style.visibility = "hidden"}, this.snapAnimationLength);
      
      // Turn the little arrow back around
      document.getElementById("pullout-tab-caret").style.transform = "";
    }

    // Hide pullout tab if we're zoomed in, you can't use it anyways
    if (this.onDevice) {
      if (window.innerWidth < window.outerWidth) {
        document.getElementById("pullout-tab").style.visibility = "hidden";
      } else {
        document.getElementById("pullout-tab").style.visibility = "initial";
      }
    }
  }

}
