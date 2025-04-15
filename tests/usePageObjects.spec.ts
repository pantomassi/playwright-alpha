import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async ({page}) => {
    await page.goto('/')
})


// a show-off that opens all dropdown menus on the page that will be needed for tests
test('navigate to different pages', async ({page}) => {
    // this will open all dropdowns required in tests, not too practical and done for course purposes
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().formLayoutsPage()    
    await page.waitForTimeout(1000) // timeout to see the navigation, otherwise it's processed too fast
    await pageManager.navigateTo().datepickerPage()
    await pageManager.navigateTo().smartTablePage()
    await pageManager.navigateTo().toastrPage()
    await pageManager.navigateTo().tooltipPage()
})


test('fill email and password, check option and submit the grid form', async ({page}) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().formLayoutsPage()

    await pageManager.onFormsLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER, process.env.PASSWORD, "Option 1")
})


test('fill and submit the inline form', async ({page}) => {
    // EXAMPLE OF REFACTOR AFTER INTRODUCING PAGE MANAGER
    // const navigateTo = new NavigationPage(page)
    // const onFormLayoutPage = new FormLayoutsPage(page)
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().formLayoutsPage()

    // await navigateTo.formLayoutsPage()
    // await onFormLayoutPage.submitInlineFormWithNameEmailAndCheckbox("Jasiu Stasiu", "jasiu@mail.com", true)
    const randomFullName = faker.person.fullName({firstName: 'Jasiu', sex: 'male'})
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(100)}@test.com` // faker.internet.email()
    // const randomEmail = faker.internet.email({firstName: "jasiu"})
    await pageManager.onFormsLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})


test('pick a date on common datepicker', async ({page}) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().datepickerPage()


    const dateToAssert = await pageManager.onDatepickerPage().pickDateInCommonDatepicker(15)
    await expect(pageManager.onDatepickerPage().commonDatepickerInputField).toHaveValue(dateToAssert)
})


test('pick a date on range datepicker', async ({page}) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().datepickerPage()

    const dateToAssert = await pageManager.onDatepickerPage().pickDateInDatepickerWithRange(-10, 11)
    await expect(pageManager.onDatepickerPage().rangeDatepickerInputField).toHaveValue(dateToAssert)
})



test.only('testing with Argos CI', async ({page}) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page");
    await page.waitForTimeout(1000) // timeout to see the navigation, otherwise it's processed too fast
    await pageManager.navigateTo().datepickerPage()
    await argosScreenshot(page, "datepicker page");
})
