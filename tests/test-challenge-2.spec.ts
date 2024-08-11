// Import Playwright's test and expect modules
import { test, expect } from '@playwright/test';
import { checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app';

// Describe block
test.describe('TodoMVC - Edit an existing todo item', () => {

    const TODO_ITEM = 'Edit this todo item';
    const UPDATED_TODO_ITEM = 'This todo item has been updated';

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

    test('should edit a todo item and verify it gets updated with the new changes', async ({ page }) => {
        // Double-click the todo item to enable editing
        const todoItemLabel = page.locator('.todo-list li .view label', { hasText: TODO_ITEM });
        await todoItemLabel.dblclick();

        // Clear the existing text and enter new text
        const todoEditInput = page.locator('.todo-list li.editing .edit');
        await todoEditInput.fill(UPDATED_TODO_ITEM);
        await todoEditInput.press('Enter');

        // Verify that the item has been updated
        const todoItems = page.getByTestId('todo-title');
        await expect(todoItems).toHaveText([UPDATED_TODO_ITEM]);

        // Leverage helper function to confirm the updated text value in local storage
        await checkTodosInLocalStorage(page, UPDATED_TODO_ITEM);
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
});
