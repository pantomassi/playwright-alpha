import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {     // will run before every test in this file
    await page.goto('localhost:4200')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test("Locator syntax rules", async({page}) => {
    // locator by html tag name
    page.locator('input')

    // by id
    await page.locator('#inputEmail1').click()

    // by class value
    page.locator('.shape-rectangle')

    // by full class value 
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // by attribute
    page.locator('[placeholder="Email"]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput].shape-rectangle')

    // by xpath
    page.locator('//*[@id="inputEmail1"]')

    // partial text match
    page.locator(':text("Using")')

    // by exact text match - whole text is exactly this, any extra or less chars is not a match 
    page.locator(':text-is("Using")')
})


test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the grid').click()

    await page.getByTestId('signInButton').click()

    await page.getByTitle('IoT Dashboard').click()
})



test('Locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio :text-is("Option 1")').click()

    await page.locator('nb-card').getByRole('button',{name: "Sign in"}).first().click()
})


test('Locating parent elements', async ({page}) => {
    //filtering output of locator() method by text in the second argument of locator()
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    //filtering output of locator() method by another locator in the second argument of locator()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    //filtering output of locator() method by text in the second argument of locator(), using built-in method filter()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    //filtering output of locator() method by another locator in the second argument of locator(), using built-in method filter
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()


    // Why use filter() instead of first solution - it's narrowing down the results until you get the desired result, applying as many filters as you want. Here filtering a locator first by checkboxes - this returns 3 elements, then again chain-filtered by unique text to find the one element we're looking for. Then at the end finding a specific element within the selected locator
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
        .getByRole('textbox', {name: "Email"}).click()

    // not a preferred method to find parent elements in selectors, but can be used nonetheless - choose an element and then redirect to its direct parent (only one level up). The double dot is actually getting xpath of parent
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})



test('Reusing locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailInput = basicForm.getByRole('textbox', {name: "Email"})

    await emailInput.fill('yo yo')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('pass12345')
    // there are many nb-checkbox'es on the page, but there is only 1 in basicForm, so you don't need to be more specific
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailInput).toHaveValue('yo yo')
})



test('Extracting values', async ({page}) => {
    // find & assert text value in a single element (does it exist in the found element?)
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // find & assert text value in multiple elements (does it exist in any of found elements?)
    // allTextContents() grabs all values from each found element and put them in an array, so 'radioTexts' is an array
    // if error: << Expected value: "Option x" Received array: ["Option 1", "Option 2", "Disabled Option"] >>
    const radioTexts = await page.locator('nb-radio').allTextContents()
    expect(radioTexts).toContain("Option 1")

    // input fields values - text from inputs can't be found by inspecting the DOM, need to grab them with inputValue()
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill("Jasiu")
    const emailFieldValue = await emailField.inputValue()
    expect(emailFieldValue).toEqual("Jasiu")

    // grabbing values of attributes of an html element - this exists in DOM
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual("Email")
})


test('Assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // Generic assertions
    const value = 5
    expect(value).toEqual(5)

    const buttonText = await basicFormButton.textContent()
    expect(buttonText).toEqual("Submit")

    // Locator assertions
    await expect(basicFormButton).toHaveText("Submit")

    // Soft assertion - if soft assertion fails, everything below it continues
    await expect.soft(basicFormButton).toHaveText("Submit")
    await basicFormButton.click()   // if assertion in line above wasn't soft and it failed, this would not execute
})


test('Auto-waiting', async ({page}) => {
    
})