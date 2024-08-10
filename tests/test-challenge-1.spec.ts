//Import Playwright's test and expect modules
import { test, expect } from '@playwright/test'

//Describe block
test.describe('New ToDo item positioning on list', () => {

    const TODO_ITEMS = [
        'Write a new Playwright test',
        'Automate existing test cases',
        'Review test results'
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');
    })

    test('should create multiple todo items and verify the alst item appears last on the list', async ({ page }) => {
        const newTodo = page.getByPlaceholder('What needs to be done?');

        // create each todo item from the TODO_ITEMS array
        for (const item of TODO_ITEMS) {
            await newTodo.fill(item);
            await newTodo.press('Enter');
        }

        //verify that the list contains all three items and the last item appears on the list
        const todoItems = page.locator('.todo-list li, view label');
        await expect(todoItems).toHaveText(TODO_ITEMS);
    });
})