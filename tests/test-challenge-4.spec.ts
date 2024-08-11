// Import Playwright's test and expect modules
import { test, expect } from '@playwright/test';
import { checkNumberOfTodosInLocalStorage, checkNumberOfCompletedTodosInLocalStorage } from '../src/todo-app';

// Describe block
test.describe('TodoMVC - Mark a todo item as completed', () => {

    const TODO_ITEM = 'Complete this todo item';

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // Create a new todo item
        const newTodo = page.getByPlaceholder('What needs to be done?');
        await newTodo.fill(TODO_ITEM);
        await newTodo.press('Enter');

        // Verify the item has been added
        const todoItems = page.locator('.todo-list li .view label');
        await expect(todoItems).toHaveText([TODO_ITEM]);
        await checkNumberOfTodosInLocalStorage(page, 1);
    });

    test('should mark a todo item as completed and verify it is marked with a green check mark and strikethrough', async ({ page }) => {
        // Locate the todo item's corresponding checkbox to mark it as completed using data-testid
        const todoItemCheckbox = page.locator('.toggle');
        await todoItemCheckbox.click();

        // Verify that the item is crossed off with a strikethrough
        const todoItemLabel = page.locator(`[data-testid="todo-item"]`);
        await expect(todoItemLabel).toHaveClass(/completed/);

        // ensure font has a line through it
        const todoItemText = page.locator('.view').locator('label');
        const textDecoration = await todoItemText.evaluate(element => getComputedStyle(element).textDecoration);
        expect(textDecoration).toContain('line-through');

        // Leverage helper function to confirm the number of completed items in local storage
        await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    });

    test.afterEach(async ({ page }) => {
        // Use a locator to find all todo items
        const todoItems = page.locator('.todo-list li');

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
        await checkNumberOfCompletedTodosInLocalStorage(page, 0);
    });
});