// Import Playwright's test and expect modules
import { test, expect } from '@playwright/test';
import { checkNumberOfTodosInLocalStorage, checkNumberOfCompletedTodosInLocalStorage } from '../src/todo-app';

// Describe block
test.describe('TodoMVC - View Active list shows only active (not completed) items', () => {

    const TODO_ITEMS = [
        'Active todo item 1',
        'Complete this todo item',
        'Active todo item 2'
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // Create new todo items
        const newTodo = page.getByPlaceholder('What needs to be done?');
        for (const item of TODO_ITEMS) {
            await newTodo.fill(item);
            await newTodo.press('Enter');
        }

        // Mark the second item as completed
        const secondTodoToggle = page.locator('.toggle').nth(1); // Adjust the selector if needed
        await secondTodoToggle.click();

        // Verify the items have been added
        const todoItems = page.locator('.todo-list li .view label');
        await expect(todoItems).toHaveText(TODO_ITEMS);
        await checkNumberOfTodosInLocalStorage(page, 3);
        await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    });

    test('should show only active items when viewing the Active list', async ({ page }) => {
        // Click on the "Active" link to view the active list
        const activeLink = page.locator('a', { hasText: 'Active' });
        await activeLink.click();

        // Locate the todo list items
        const todoItems = page.locator('.todo-list li');

        // Verify only active (not completed) todo items are shown
        const activeItems = [
            'Active todo item 1',
            'Active todo item 2'
        ];
        
        for (const item of activeItems) {
            const todoItem = todoItems.locator('.view label', { hasText: item });
            await expect(todoItem).toBeVisible();
        }

        // Verify that completed items are not shown
        const completedItem = todoItems.locator('.view label', { hasText: 'Complete this todo item' });
        await expect(completedItem).toBeHidden();
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
    });
});