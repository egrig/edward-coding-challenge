//Import Playwright's test and expect modules
import { test, expect } from '@playwright/test'
import { checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app';

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
        const todoItems = page.getByTestId('todo-title');
        await expect(todoItems).toHaveText(TODO_ITEMS);

        // leverage helper function to confirm text values in local storage is correct
        for (const item of TODO_ITEMS) {
            await checkTodosInLocalStorage(page, item);
        }

        // leverage helper function to confirm item count
        await checkNumberOfTodosInLocalStorage(page, 3);
    });

    test.afterEach(async ({ page }) => {
        // Use a locator to find all todo items
        const todoItems = page.getByTestId('todo-item');
    
        // Get the count of todo items
        const count = await todoItems.count();
    
        // Iterate over each item, hover over it to reveal the destroy button, and click the destroy button
        for (let i = 0; i < count; i++) {
            await todoItems.nth(0).hover();
            await todoItems.nth(0).locator('.destroy').click();
        }
    
        // Confirm the cleanup worked by checking no todo items are present
        await expect(todoItems).toHaveCount(0);
        await checkNumberOfTodosInLocalStorage(page, 0);
    });
})