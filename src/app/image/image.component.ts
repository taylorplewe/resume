import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HandleScroll } from '../handle-scroll';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit, AfterViewInit {

    // ms's before it starts opening animation; to ensure it sets the style values and then resets them on different frames
    openAnimWaitTime = 50;

    zoomedImgScreenPercentage = 0.9; // Percent of the screen the image will take up (while keeping its aspect ratio)
    animLength = 300; // @open-image-transition-length
    blackoutOpacity = 0.75; // When image is clicked on
    clickability = true;

    // We want to disable the enlarging ability if the sidenav is appearing on top of the main section
    // This is temporary
    // It's just because the image blackout can't appear on top of the sidenav when it's like that
    // At a future date I want to enable clickability for all screen sizes
    breakpointXL = 1366;

    // For resetting the values when you close the image
    ogSrc : string;
    ogWidth : number;
    ogHeight : number;

    @Input() imgSrc : string;
    @Input() captionText : string;
    @Input() dispType : string;
    @ViewChild("placeHolder") placeHolderRef : ElementRef;
    @ViewChild("imgNormal") imgNormalRef : ElementRef;
    @ViewChild("imgZoomed") imgZoomedRef : ElementRef;
    @ViewChild("imgBlackout") blackoutRef : ElementRef;

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit() : void {
        this.ogSrc = this.imgNormalRef.nativeElement.src;
        if (this.dispType == "collection") this.imgNormalRef.nativeElement.classList.add("collection");
        this.checkClickability();
    }

    checkClickability() : void {
        if (document.getElementById("pullout-pane") || window.innerWidth < this.breakpointXL) {
            this.clickability = false;
            this.imgNormalRef.nativeElement.style.cursor = "initial";
        } else {
            this.clickability = true;
            this.imgNormalRef.nativeElement.style.cursor = "pointer";
        }
    }

    windowResize() : void {
        this.closeImage();
        this.checkClickability();
    }

    openImage() : void {
        // If we're on small screens, this feature is disabled (for now)
        if (!this.clickability) return;
        
        HandleScroll.disableScroll();

        // Make the blackout appear
        this.blackoutRef.nativeElement.style.visibility = "visible";
        this.blackoutRef.nativeElement.style.opacity = this.blackoutOpacity;

        // Save the original dimensions and natural dimensions of the image element
        const ogElWidth = this.imgNormalRef.nativeElement.width;
        const ogElHeight = this.imgNormalRef.nativeElement.height;
        const natWidth = this.imgNormalRef.nativeElement.naturalWidth;
        const natHeight = this.imgNormalRef.nativeElement.naturalHeight;
        const imgPosX = this.imgNormalRef.nativeElement.getBoundingClientRect().x; // The x coord's of the image relative to viewport
        const imgPosY = this.imgNormalRef.nativeElement.getBoundingClientRect().y; // Y coord's
        this.ogWidth = ogElWidth;
        this.ogHeight = ogElHeight;

        // Make the placeholder, which will have a default "position" value, take on the image's dimensions so empty the space doesn't collapse
        this.placeHolderRef.nativeElement.width = ogElWidth;
        this.placeHolderRef.nativeElement.height = ogElHeight;
        this.imgNormalRef.nativeElement.style.visibility = "hidden";

        // Style the image for its new state appropriately
        this.imgZoomedRef.nativeElement.style.visibility = "initial";
        this.imgZoomedRef.nativeElement.classList.add("no-transition");
        this.imgZoomedRef.nativeElement.style.left = imgPosX + "px";
        this.imgZoomedRef.nativeElement.style.top = imgPosY + "px";
        this.imgZoomedRef.nativeElement.style.width = ogElWidth + "px";
        this.imgZoomedRef.nativeElement.style.height = ogElHeight + "px";
        this.imgZoomedRef.nativeElement.style.zIndex = "40"; // Blackout = 30, mainSection = 10, sideNav = 0 or 20

        // SIZING
        // We want to have the image take up as much space as comfortably possible.
        // To do this we must first find out if the screen is portrait or landscape:
        const portrait = window.innerHeight > window.innerWidth ? true : false;
        // And then use either of these two variables to resize the image; width for portrait, height for landscape:
        let targetWidth : any; // So they can change to a string after calculations
        let targetHeight : any;
        targetWidth = Math.min(document.documentElement.clientWidth * this.zoomedImgScreenPercentage, natWidth);
        targetHeight = Math.min(window.innerHeight * this.zoomedImgScreenPercentage, natHeight);
        // The other dimension (height for portrait, width for landscape) wll be calculated based on the image's natural aspect ratio:
        const aspRatio = natHeight / natWidth;
        if (portrait) targetHeight = targetWidth * aspRatio;
        else targetWidth = targetHeight / aspRatio;
        // Finally, if the other dimension (h for portrait, w for landscape) exceeds its boundaries, then it takes precidence
        if (portrait && targetHeight > (window.innerHeight * this.zoomedImgScreenPercentage)) {
            targetHeight = window.innerHeight * this.zoomedImgScreenPercentage;
            targetWidth = targetHeight / aspRatio;
        } else if (!portrait && targetWidth > (document.documentElement.clientWidth * this.zoomedImgScreenPercentage)) {
            targetWidth = document.documentElement.clientWidth * this.zoomedImgScreenPercentage;
            targetHeight = targetWidth * aspRatio;
        }

        // POSITIONING
        const targetX = ((document.documentElement.clientWidth / 2) - (targetWidth / 2)) + "px";
        const targetY = ((window.innerHeight / 2) - (targetHeight / 2)) + "px";

        // Format these properly now that we're done with animations
        targetWidth += "px";
        targetHeight += "px";

        // Move and resize the image. The timeout is so that the animation will actually play.
        setTimeout(() => {
            this.imgZoomedRef.nativeElement.classList.remove("no-transition");
            this.imgZoomedRef.nativeElement.style.left = targetX;
            this.imgZoomedRef.nativeElement.style.top = targetY;
            this.imgZoomedRef.nativeElement.style.width = targetWidth;
            this.imgZoomedRef.nativeElement.style.height = targetHeight;
        }, this.openAnimWaitTime);
    }

    closeImage() : void {
        // Begin a transition where the blackout fades out and the zoomed image goes back to where it was
        this.blackoutRef.nativeElement.style.opacity = 0;
        this.imgZoomedRef.nativeElement.style.width = this.ogWidth + "px";
        this.imgZoomedRef.nativeElement.style.height = this.ogHeight + "px";
        this.imgZoomedRef.nativeElement.style.top = this.placeHolderRef.nativeElement.getBoundingClientRect().y + "px";
        this.imgZoomedRef.nativeElement.style.left = this.placeHolderRef.nativeElement.getBoundingClientRect().x + "px";

        // After transition is done, put everything back to where it was at the beginning.
        setTimeout(() => {
            HandleScroll.enableScroll();
            this.blackoutRef.nativeElement.style.visibility = "hidden";
            this.imgZoomedRef.nativeElement.style.visibility = "hidden";
            this.placeHolderRef.nativeElement.width = 0;
            this.placeHolderRef.nativeElement.height = 0;
            this.imgNormalRef.nativeElement.style.visibility = "initial";
        }, this.animLength);
    }

}
