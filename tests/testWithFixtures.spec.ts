import {test} from '../test-options'
import { faker } from '@faker-js/faker'


test('fill and submit the inline form', async ({pageManager}) => {
    const randomFullName = faker.person.fullName({firstName: 'Jasiu', sex: 'male'})
    const randomEmail = `${randomFullName}${faker.number.int(100)}@test.com`.replace(" ", "")

    await pageManager.onFormsLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER, process.env.PASSWORD, "Option 1")
    await pageManager.onFormsLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})









// INITIAL VERSION - beforeEach, page creation and test data preparation all can be moved to a fixture

// test.beforeEach(async ({page}) => {
//     await page.goto('/')
// })


// test('fill and submit the inline form', async ({page}) => {
//     const pageManager = new PageManager(page)
//     const randomFullName = faker.person.fullName({firstName: 'Jasiu', sex: 'male'})
//     const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(100)}@test.com`

//     await pageManager.navigateTo().formLayoutsPage()
//     await pageManager.onFormsLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
// })