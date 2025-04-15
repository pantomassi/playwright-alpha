import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGridForm.getByLabel(optionText).check({force: true})
        await usingTheGridForm.getByRole('button', {name: "sign in"}).click()
    }

    /**
     * This method fills out the inline form with user details and optionally checks 'Remember me' checkbox
     * @param name - should be in [first name] [last name] format
     * @param email - valid email for the test user
     * @param rememberMe - optional for checking 'Remember me' box to save the session, false by default
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean = false) {
        const usingTheInlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await usingTheInlineForm.getByPlaceholder('Jane Doe').fill(name)
        await usingTheInlineForm.getByPlaceholder('Email').fill(email)
        if (rememberMe) {
            await usingTheInlineForm.getByLabel('Remember me').check({force: true})
        }
        await usingTheInlineForm.getByRole('button', {name: "SUBMIT"}).click()
    } 
}