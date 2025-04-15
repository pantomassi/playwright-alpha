import {expect} from '@playwright/test'
import {test} from '../test-options'

test('Drag & Drop with iFrames', async ({page, globalsQaURL}) => {
    await page.goto(globalsQaURL)

    // iFrame is embedded html document inside of the existing document (like a page inside a page). If an element you want to grab is inside an iFrame, you first need to access the iFrame. To find the iFrame, treat it like any locator (find its parent), but instead of using locator(), use frameLocator()
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

    // now you can look for the exact element you need, but already inside the iFrame. From now on, anything inside the iFrame needs to be accessed directly through it, instead of outer page

    // 1. dragging with dragTo() - the target area to which the element should be dropped can be identified through a locator
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))


    // 2. dragging with direct mouse movements. Move over onto the dragged element, down the mouse button, and hover elsewhere. Frame locator is for finding elements visually in the structure, general actions like clicks are done with page object
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    // Find the target area, it should contain the dragged elements
    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])

})