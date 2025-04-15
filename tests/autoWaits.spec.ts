import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {     // will run before every test in this file
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
})

// How to modify timeout for the whole suite (for all tests in this file)
test.beforeEach(async ({page}, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 2000)
})


test('Locator methods with auto wait built-in', async ({page}) => {
    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // will wait until element appears on the page and then click it
    await successBackground.click()

    // textContent also waits for element, then grabs its text. If click() is uncommented out above, it will already auto-wait for the element, but textContent() alone will also auto-wait
    const text = await successBackground.textContent()
    expect(text).toEqual('Data loaded with AJAX get request.')
})


test('Locator method with no wait for element default behavior', async ({page}) => {
    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // allTextContents will not wait for the element to appear on the page. There are also no auto/manual wait methods above this code, so there will be nothing retrieved by allTextContents, and subsequently, the assertion will fail as it will look for the string in an empty array 
    const textInManyElementsNoWait = await successBackground.allTextContents()
    expect(textInManyElementsNoWait).toContain('Data loaded with AJAX get request.')
})


test('Locator method with no wait for element default behavior - manual wait added', async ({page}) => {
    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // additional line with manual wait for element, because locator method allTextContents doesn't have wait built-in. If no previous code lines had a wait applied, the wait will be handled by the first line here, and if there were some waits, the first line from this block will just do nothing. Either way, allTextContents will now successfully retrieve strings into arrays, instead of returning an empty array on which toContain() would fail
    await successBackground.waitFor({state: "attached"})
    const textInManyElements = await successBackground.allTextContents()
    expect(textInManyElements).toContain('Data loaded with AJAX get request.')
})


test('Assertion method with no wait default behavior - additional timeout added', async ({page}) => {
    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // There is a default fixed timeout of 5s for locator assertions, but if loading the element takes longer than that, the assertion will fail. The element here takes 15s, so if you additionally don't add the ", {timeout: 15000}" to assertion part, it will fail by time out
    await expect(successBackground).toHaveText('Data loaded with AJAX get request.')
    await expect(successBackground).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})


test('Aternative waits', async ({page}) => {
    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // wait for an element - pass locator
    await page.waitForSelector('.bg-success')

    // wait for receiving a response from backend - pass url to which request was made
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for all network calls to be completed - not recommended, if some calls get stuck, the whole test is stuck as well
    await page.waitForLoadState('networkidle')

    // hardcoded timeout wait - not recommended
    await page.waitForTimeout(20000)
    
    // other types of waits - see VSC suggestions for 'page.waitFor...'


    // These are just methods to grab content and assert it, the issue is only with no waiting for the content in allTextContents, which results in asserting on empty element. The above methods are various ways to make that wait, each is an alternative of the other, so any one of these will suffice
    const textInManyElements = await successBackground.allTextContents()
    expect(textInManyElements).toContain('Data loaded with AJAX get request.')
})




test('Timeouts', async ({page}) => {
    test.setTimeout(40000)

    // this element takes 15s to appear on the page
    const successBackground = page.locator('.bg-success')

    // will wait until element appears on the page and then click it
    await successBackground.click({timeout: 16000})
})