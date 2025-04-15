// not a separate page with dedicated url, this just deals with the navigation bar that is always visible

// General tips:
// Page is a playwright fixture
// readonly is a modifier that makes a property of a class (or interface) immutable after it is initialized. Once a property is marked as readonly, its value cannot be changed after the object has been created. It essentially enforces that the property can only be set once, either during initialization or in the constructor.
// defining locators like below is done here at least for demonstration purposes, but in real projects it's better to avoid too many locators that are used just once, otherwise the section with proprties and then defined locators in constructor will bloat too much just for the sake of defining locators. Better define locators as properties if they are used in more than one method/multiple times rather than just once
// some people advocate for not defining locators like that and keeping them TOGETHER with the functional methods that use them, the argument is that if page object methods are functional enough and cover much scope, there will be max 2-3 duplications between methods. Also, having locators inside functional methods makes them easier to debug/maintain. Then when a test fails you see the exact line of code where it failed
// when working with multiple qa's on a project, it often happens that people duplicate the definitions of locators, just naming them differently - look out for that


import { Page, Locator } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
    // readonly page: Page;  - no longer need it as it's already inherited from HelperBase
    readonly formLayoutsMenuItem: Locator;
    readonly datePickerMenuItem: Locator;
    readonly smartTableMenuItem: Locator;
    readonly toastrMenuItem: Locator;
    readonly tooltipMenuItem: Locator;


    constructor(page: Page) {
        super(page) // runs constructor of the base class - HelperBase - using 'page' as argument
        this.formLayoutsMenuItem = this.page.getByText('Form Layouts')
        this.datePickerMenuItem = this.page.getByText('Datepicker')
        this.smartTableMenuItem = this.page.getByText('Smart Table')
        this.toastrMenuItem = this.page.getByText('Toastr')
        this.tooltipMenuItem = this.page.getByText('Tooltip')
    }

    

    // each method navigates to a specific part of the page
    async formLayoutsPage() { // method for navigating to specific page
        // using page instance that was accepted into constructor, in practice it'll be initialized/passed in our tests
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(1) // method of base class we extended
    }

    async datepickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()     
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()       
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()       
    }

    // when you have multiple steps in a test, multiple methods that all begin with opening a dropdown, which is required when they are used on their own, but when another method already did that in the test, the step is not only useless, but also it will close the whole dropdown that already was visible. Being expanded or not in our application is decided by the property "aria-expanded" (if 'true', dropdown is expanded). This is a helper method that checks if dropdown is expanded already. If yes - nothing happens, if not - it's opened
    // note on groupMenuItem locator - it's an argument against defining locators in constructor and keeping them in methods, as locators end up being in two places - some of them are in constructor, and some of them cannot be there, like this one which is dynamic
    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false') {
            await groupMenuItem.click()  // if menu item is not expanded, click it
        }
    }
}
