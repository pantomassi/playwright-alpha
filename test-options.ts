// this file is like a placeholder for env variable names, but also holds fixtures
import { test as base } from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

// creating a new type, which is basically an object in this case that holds a string variable
export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

// extending our new type, so adding some new functionality to 'test' (which is TestType) aka 'base' for our new object. Here is where you implement items from TestOptions, they are either variables of fixtures
export const test = base.extend<TestOptions> ({
    globalsQaURL: ['', {option: true}],

    // fixture creation, using another (builtin) fixture - page. The fixture is initialized even before the browser opens, so it's faster than initializing this data after that
    formLayoutsPage: async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')   // defined above that 'formLayoutsPage' is a string, so need to provide a string
        console.log("Teardown phase")
    },

    pageManager: async({page, formLayoutsPage}, use) => {
        const pageManager = new PageManager(page)
        await use(pageManager)
    }
})
