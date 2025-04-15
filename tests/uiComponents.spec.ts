import {test, expect} from '@playwright/test'

// test.describe.configure({mode: 'parallel'})

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe.only('Form Layouts page', () => {
    test.describe.configure({retries: 2})   //- inline definition of number of retries instead of in playwright.config

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async ({page}, testInfo) => {
        if (testInfo.retry) {
            // do something like db cleanup
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "email"})
    await page.pause()

        await usingTheGridEmailInput.fill("email@mail.com")  // fills field instantly
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("emailemail@mail.com", {delay: 200})  // imitates keyboard strokes
    
    
        // 1. generic assertions
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('emailemail@mail.com')
    
        // 2. locator assertions
        await expect(usingTheGridEmailInput).toHaveValue('emailemail@mail.com') // not toHaveText()!
    })
    
    
    test('Radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
    
        // check() is the method for selecting radio buttons. It checks for element visibility, clickability etc. If checkable element has class of 'visibility-hidden', it will not count as visible. To bypass this availability validation, you need to add param force:true, this disables verification of various statuses that check() (or any other method you apply this to) is waiting for
        await usingTheGridForm.getByLabel('Option 1').check({force: true})
    
        // this will do the same as above - check radio option 1
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
    
    
        // generic assertion - first get the status of radio button (checked or not), isChecked() returns a boolean, then assert it by checking if it's truthy or falsy
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()
    
    
        // locator assertion - use ready method toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()
    

        // Validate that after checking option 2, option 1 is not checked. Using generic assertion - you can pass the status directly to expect() without saving it as a constant
        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})


test('Checkbox', async ({page}) => {
    await page.getByText('Modal & overlays').click()
    await page.getByText('Toastr').click()

    // can just click() on the whole checkbox (which consists of both text and checkable box) or check(), uncheck(). Check vs click: check()/uncheck() are more precise - they leave the box in the exact requested state, while click() will invert the status of the box - it doesn't check the status of the checkbox. Preferred method is check()
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    // check or uncheck all checkboxes on the page - find locators of all checkboxes, then loop through them and (un)check them. getByRole() will return a Locator of multiple elements, but it's not a collection/array of those elements, so first need to convert this list into an actual array with all(), remember that all() is a Promise, so need to use await
    // in assertions - check is isChecked() or isUnchecked() is truthy or falsy
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({force: true})
        expect(await box.isChecked).toBeTruthy()
    }
})


test('Lists and dropdowns', async ({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    // page.getByRole('list') - finding list when it has <ul> tag. 'list' is parent container for entire list, <ul class="option-list">
    // page.getByRole('listitem') - finding specific items on a list with <li> tag. Some apps may use other tags of the library that is used, for example <nb-option>, then you have to use a regular locator

    // get the list of all options
    // const optionsList = page.getByRole('list').locator('nb-option') - alternative
    const optionsList = page.locator('nb-option-list nb-option')

    // check that the list has all options we expect it to have
    await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionsList.filter({hasText: "Cosmic"}).click()

    // validate background color of page's body after change - see Styles/background-color in Console for nb-layout-header tag. Assert the value of rgb/hex
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')
    // await expect(header).toHaveCSS('background-color', '#323259')  - doesn't work with hex directly, not sure why?

    // validate that choosing all background colors from the dropdown sets the right color, Light and Corp are the same
    const colors = {
         "Light": "rgb(255, 255, 255)",
         "Dark": "rgb(34, 43, 69)",
         "Cosmic": "rgb(50, 50, 89)",
         "Corporate": "rgb(255, 255, 255)"
    }

    for(const color in colors) {
        await dropdownMenu.click() // need to make sure that before choosing options the dropdown menu is opened
        await optionsList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
    }
})



test('Tooltips', async ({page}) => {
    await page.getByText('Modal & overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await tooltipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') // works only if you have an element with role 'tooltip' in DOM
    const tooltip = await page.locator('nb-tooltip').textContent() // grabbing the value of tooltip

    expect(tooltip).toEqual("This is a tooltip")
})



test('Dialog boxes', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // this is a listener and can be defined anywhere, it doesn't matter that it may appear after some actions defined below it
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?') // making sure what dialog appeared
        dialog.accept()
    })

    // finding specific table row with specific text and clicking trash icon next to it, the listener above will handle accepting the dialog. Then check if record has been sucessfully deleted
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click() 
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")
})


test('Tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1. get row by any text in it
    const targetRow  = page.getByRole("row", {name: "twitter@outlook.com"})  // finding by role with a given property
    await targetRow.locator(".nb-edit").click()  // turned ON edit mode, previous locator can no longer be used - DOM changed
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('20')
    await page.locator('.nb-checkmark').click()  // confirm changes, out of edit mode


    // 2. get row based by a value in a specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click() // get 2nd page of records4

    // const targetRowById = page.getByRole('row', {name: "11"}) - erroneous code, 2 possible locators found (rows 11 & 16)
    // instead, get all rows with value '11', then filter by rows that have text '11' in 2nd column (index: 1) - it's id column
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click() // go into edit mode
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()   // new locator needed in edit mode
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()  // out of edit mode
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com') // assert text value in 5th column


    // 3. test filtering functionality (filter on a column) - confirm only relevant results are returned / looping through rows
    const ages = ["20", "30", "40", "200"]  // ages we'll want to check - test data

    for (let age of ages) {
        // first find and clear the search field and then fill it with the age we're iterating now
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        // need to wait till filter is processed, otherwise playwright will look for results before new results are reloaded
        await page.waitForTimeout(500)

        // now search should have left only filtered out records, grab all the rows
        const foundRows = page.locator('tbody tr')

        // loop through the found rows and confirm they only have the value we filtered by
        for (let row of await foundRows.all()) {
            const rowAgeCellValue = await page.locator('td').last().textContent()

            // edge case
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain("No data found")
            } else {
                expect(rowAgeCellValue).toEqual(age)
            }
        }   
    }
})




test('Date picker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const formPickerInputField = page.getByPlaceholder("Form Picker")
    await formPickerInputField.click() // opens the calendar

    // [class="1 2"] will select all current month's days, using this form because specifying by multiple classes
    // looking for exact matches, as single digit days will have multiple matches in the calendar
    // this chooses a hardcoded day, not preferred way
    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('5', {exact: true}).click()
    // await expect(formPickerInputField).toHaveValue("Mar 5, 2025")

    // Using javascript Date object to manage the dates used for tests, instead of hardcoding them
    const today = new Date() // this creates today's date by default
    const todayDayOfMonth = today.getDate().toString()
    const todayMonthShort = today.toLocaleString('En-US', {month: 'short'})
    const todayYear = today.getFullYear()
    const todayAsString = `${todayMonthShort} ${todayDayOfMonth}, ${todayYear}`

    let dateToCheck = new Date()
    dateToCheck.setDate(dateToCheck.getDate() + 0) // how many days to add

    const expectedDay = dateToCheck.getDate().toString()
    const expectedMonthShort = dateToCheck.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = dateToCheck.toLocaleString('En-US', {month: 'long'})
    const expectedYear = dateToCheck.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`

    let currentCalendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedCalendarMonthAndYear = `${expectedMonthLong} ${expectedYear}`

    // change month on datepicker if needed
    if (dateToCheck < today) {
        // moving in past direction. Using includes() instead of != bc picker returns " MON DD, YYYY " (spaces)
        while (!currentCalendarMonthAndYear.includes(expectedCalendarMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-left"]').click()
            // see what is current month and year after moving one month ahead
            currentCalendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }
    } else if (dateToCheck > today) {
        // moving in future direction
        while (!currentCalendarMonthAndYear.includes(expectedCalendarMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            // see what is current month and year after moving one month ahead
            currentCalendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }
    }
    

    // choose day in calendar and then check if field above was populated with the right string of MON DD, YYYY, today's day has a different class than other days in the month, the grayed out days from other months also have different class than today and other days from current month
    if (dateToAssert == todayAsString) {
        await page.locator('[class="today day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()
    } else {
        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()
    }

    await expect(formPickerInputField).toHaveValue(dateToAssert)
})


test('Sliders', async ({page}) => {
    await page.getByText('IoT Dashboard').click()

    // 1. test by updating slider attribute to move it into a position that reflects a given value
        // const temperatureGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    // manually dragged the gauge to max and checked what are the coordinates cx and cy, now move the gauge there
    // 'gauge' is an arbitrary name, just need an argument with any name.
        // await temperatureGauge.evaluate( gauge => {
        //     gauge.setAttribute('cx', '232.630')
        //     gauge.setAttribute('cy', '232.630')
        // })
    // Moving the gauge (circle) by itself only causes the circle to move, but the value it relates to is not changed, nor the bar gets filled - event signaling the change hasn't fired off, so need to make any action with the element
        // await temperatureGauge.click()




    // 2. test by simulating moving the slider with mouse to a specific spot. Also, in UI, there might be a line representing the movement, but you don't need to grab exactly this line and move along it - there should be a whole box where holding & dragging has an effect on the slider (so holding the left click a bit above/below/to left or right and moving in some direction still updates the slider). The target area to which you want to move the mouse should be completely in the view of browser view (visually you must see it). In this case, this will require scrolling down a little bit
    const temperatureBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await temperatureBox.scrollIntoViewIfNeeded()

    // define a bounding box. The tempBox is a 300x300 box. When you call boundingBox() on it, the top left corner of it becomes the starting point (0, 0) and X & Y coordinates are created. The corner just defines the (0,0) and you can move the mouse pointer outside of the bounding box, so more than 300 in either direction, as well as move up/to the left of the box, which represents negative X & Y values. The only limit how far poitner can be moved is the browser view
    // accessing coordinates of the box : box.x, box.y
    const box = await temperatureBox.boundingBox()
    
    // defining a new center/starting point in the center of the bounding box (started in top left). Picking a spot from where you can move the pointer the same length in either left or right direction. Box.x and .y are initially 0. Moving the pointer to the left is x-int, to the right is x+int, same goes for y - moving up is y-int, moving down is y+int
    const x = box.x + box.width/2
    const y = box.y + box.height/2
    await page.mouse.move(x, y) // first action is to put the mouse in the center spot we defined above
    await page.mouse.down()  // click and hold the button, which is prerequisite to further movements

    // this case is very specific as the slider moves in an angle (like 5/6 length of circle, it moves both horizontally and vertically, but usually you'll see only horizontal sliders)
    await page.mouse.move(x-100, y) // moving only horizontally to the right or left: x+/-int, y stays the same
    await page.mouse.move(x-100, y+120)  // the move is only vertical to the bottom now, but still need x+/-100, as x is an unchanged starting coordinate, it's not CURRENT x spot of mouse pointer
    await page.mouse.up()

    await expect(temperatureBox).toContainText("12")
})

