// Import Playwright's test and expect modules
import { test, expect } from '@playwright/test';
import { checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app';

// Describe block
test.describe('TodoMVC - Delete a todo item', () => {

    const TODO_ITEM = 'Delete this todo item';

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // Create a new todo item
        const newTodo = page.getByPlaceholder('What needs to be done?');
        await newTodo.fill(TODO_ITEM);
        await newTodo.press('Enter');

        // Verify the item has been added
        const todoItems = page.getByTestId('todo-title');
        await expect(todoItems).toHaveText([TODO_ITEM]);
        await checkTodosInLocalStorage(page, TODO_ITEM);
        await checkNumberOfTodosInLocalStorage(page, 1);
    });

    test('should delete a todo item using the red X and verify it is removed from the list', async ({ page }) => {
        // Locate the todo item and its corresponding destroy button (red X)
        const todoItem = page.locator('.todo-list li', { hasText: TODO_ITEM });
        await todoItem.hover(); // Hovering to ensure the red X is visible

        // Click the destroy button (red X) to delete the todo item
        const destroyButton = todoItem.locator('.destroy');
        await destroyButton.click();

        // Confirm the todo item has been removed
        const todoItems = page.getByTestId('todo-title');
        await expect(todoItems).not.toHaveText([TODO_ITEM]);

        // Leverage helper function to confirm the text value is removed from local storage
        await checkNumberOfTodosInLocalStorage(page, 0);
    });

    // not needed for this test, but keeping it here for consistency
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
});