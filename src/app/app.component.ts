import { Component, ViewChild, ComponentFactoryResolver, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { PageDirective } from './page.directive';
import { PageMeComponent } from './pages/page-me/page-me.component';
import { PageExperienceComponent } from './pages/page-experience/page-experience.component';
import { PageContactComponent } from './pages/page-contact/page-contact.component';
import { GetDataService } from './get-data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'tp-resume';
    currentPage = "Me"; // Home page
    currentPageComp : any; // Component of current page
    pages = {
        "Me": PageMeComponent,
        "Experience": PageExperienceComponent,
        "Contact": PageContactComponent 
    };
    timeoutLength = 600; // Milliseconds
    displaySidenav = true;
    breakpointM = 768; // Pixels
    breakpointL = 1024; // Pixels
    breakpointXL = 1366; // Pixels
    breakpointMinHeight = 700; // Size of screen height in pixels before screen changes between navigation types
    testText : string; // Paragraph string for the "Me" page, that we get from the MongoDB Node.js server application

    @ViewChild(PageDirective, {static: true /* change to false, what happens */}) pageRef : PageDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private getDataService : GetDataService
    ) { }

    ngOnInit() {
        // Get website content data from my MongoDB database, using my getDataService
        this.getDataService.getTestText().subscribe(
            result => { this.updateBackendTextOnMePage(result["data"]); }
        );

        // Home page
        this.currentPageComp = this.changePage(this.pages[this.currentPage]);
    }
    
    ngAfterViewInit() {
        this.checkScreenSize();
    }

    updateBackendTextOnMePage(text? : string) {
        if (text) {
            this.testText = text;
            if (this.currentPageComp) this.currentPageComp.instance.textFromBackend = text;
        } else {
            if (this.currentPageComp) this.currentPageComp.instance.textFromBackend = this.testText;
        }
    }

    checkScreenSize() {
        if (window.innerWidth < this.breakpointXL && (window.innerWidth < this.breakpointM || window.innerHeight < this.breakpointMinHeight)) {
            this.displaySidenav = false;
        } else {
            this.displaySidenav = true;
        }
        if (this.currentPage == "Me") {
            this.currentPageComp.instance.displayLargeHeader = 
            window.innerWidth < this.breakpointL ? false : true;
        }
    }

    // Called whenever a sidenav tab is clicked
    navigate(data : any) {
        // The Me page does two tiers of close animations
        let timeoutLength = this.currentPage == "Me" ? this.timeoutLength * 2 : this.timeoutLength;

        if (this.currentPage != data["page"]) {
            this.currentPageComp.instance.closeAnim(true);
            window.scrollTo(0, 0);

            // Allow the current page's close animation to run before changing page components
            setTimeout(() => {
                this.currentPage = data["page"];
                const currentPageComp = this.pages[this.currentPage];
                this.currentPageComp = this.changePage(currentPageComp);
                // if (this.currentPage != "Me") this.currentPageComp.instance.openAnim(); // Run the new page's open animation
                // else this.checkScreenSize();
                if (this.currentPage == "Me") {
                    this.checkScreenSize(); // The Me page needs to know whether the header is big (L and XL screens) or small (S or M screens) when it's created
                    this.updateBackendTextOnMePage();
                }
                this.currentPageComp.instance.openAnim();
            }, timeoutLength);
        }
    }

    changePage(pageComp : any) : any {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(pageComp);
        let viewContainerRef = this.pageRef.viewContainerRef;
        viewContainerRef.clear();
        return viewContainerRef.createComponent(componentFactory);
    }
}
