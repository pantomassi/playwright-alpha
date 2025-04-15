import { Page, Locator } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {
    readonly commonDatepickerInputField: Locator
    readonly rangeDatepickerInputField: Locator

    constructor(page: Page) {
        super(page)
        this.commonDatepickerInputField = page.getByPlaceholder("Form Picker")
        this.rangeDatepickerInputField = page.getByPlaceholder("Range Picker")
    }


    async pickDateInOpenedCalendar(daysFromToday: number) {
        // today - create formats for comparisons
        const today = new Date()
        const todayDayOfMonth = today.getDate().toString()
        const todayMonthShort = today.toLocaleString('En-US', {month: 'short'})
        const todayYear = today.getFullYear()
        const todaysFullDateAsString = `${todayMonthShort} ${todayDayOfMonth}, ${todayYear}`
        let currentCalendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()


        // date to pick - create formats for comparisons and final assertion
        let dateToPick = new Date()
        dateToPick.setDate(dateToPick.getDate() + daysFromToday)
        const expectedDay = dateToPick.getDate().toString()
        const expectedMonthShort = dateToPick.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = dateToPick.toLocaleString('En-US', {month: 'long'})
        const expectedYear = dateToPick.getFullYear()
        const expectedCalendarMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`


        // change month in calendar if needed before picking the selected date
        if (dateToPick < today) {
            while (!currentCalendarMonthAndYear.includes(expectedCalendarMonthAndYear)) {
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-left"]').click()
                currentCalendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
            }
        } else if (dateToPick > today) {
            while (!currentCalendarMonthAndYear.includes(expectedCalendarMonthAndYear)) {
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
                currentCalendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
            }
        }


        // today's date has different class than visible grayed out days and other current month's days. The days in common datepicker and rangepicker also differ in class names
        const todayDayCell = this.page.locator('[class="today day-cell ng-star-inserted"]')
        const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')

        const todayRangeCell = this.page.locator('[class="range-cell day-cell today ng-star-inserted"]')
        const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')


        // pick the date depending on whether it's a common picker or range picker and if it's current day
        if (await dayCell.first().isVisible()) {
            if (dateToAssert == todaysFullDateAsString) {
                await todayDayCell.getByText(expectedDay, {exact: true}).click()
            } else {
                await dayCell.getByText(expectedDay, {exact: true}).click()
            }
        } else {
            if (dateToAssert == todaysFullDateAsString) {
                await todayRangeCell.getByText(expectedDay, {exact: true}).click()
            } else {
                await rangeCell.getByText(expectedDay, {exact: true}).click()
            }
        }

        return dateToAssert
    }



    async pickDateInCommonDatepicker(daysFromToday: number) {
        await this.commonDatepickerInputField.click() // opens the calendar
        const dateToAssert = await this.pickDateInOpenedCalendar(daysFromToday)
        return dateToAssert
    }


    /**
     * 
     * @param startDateNumberOfDaysFromToday
     * @param endDateNumberOfDaysFromToday - can't be less than startDate 
     */
    async pickDateInDatepickerWithRange(
        startDateNumberOfDaysFromToday: number,
        endDateNumberOfDaysFromToday: number) {
        const rangePickerInputField = this.page.getByPlaceholder("Range Picker")
        await rangePickerInputField.click() // opens the calendar

        const dateToAssertStart = await this.pickDateInOpenedCalendar(startDateNumberOfDaysFromToday)
        const dateToAssertEnd = await this.pickDateInOpenedCalendar(endDateNumberOfDaysFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        return dateToAssert
    }
}


