import {test, expect} from '@playwright/test'


    
test('Input fields', async ({page}, testInfo) => {

    await page.goto('/')

    // additional step if the testing device is mobile, using testInfo for the check
    if(testInfo.project.name == 'Mobile Chrome') {
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

    if(testInfo.project.name == 'Mobile Chrome') {
        await page.locator('.sidebar-toggle').click()
    }

    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "email"})

    await usingTheGridEmailInput.fill("email@mail.com")  // fills field instantly
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially("emailemail@mail.com")

})