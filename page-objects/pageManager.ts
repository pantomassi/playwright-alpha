import { Page } from "@playwright/test";
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutPage'
import { DatePickerPage } from '../page-objects/datePickerPage'

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datePickerPage: DatePickerPage

    // all pages are created upfront, so when you use an instance of PageManager, you have all of the pages at hand
    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
    }

    // this method is specific to navigation to specific pages, it opens a specific page you need to define by chaining a method opening that page, e.g. navigateTo().formsLayout()
    navigateTo() {
        return this.navigationPage
    }


    // method creating an instance of FormsLayoutPage page, giving you access to its elements and methods
    onFormsLayoutPage() {
        return this.formLayoutsPage
    }

    // method creating an instance of Datepicker page, giving you access to its elements and methods
    onDatepickerPage() {
        return this.datePickerPage
    }
}