// Note that the test requirements are incorrect, because when the user clicks 'clear completed', the entries are completely removed. The correct test case should be
// Given I have marked a todo item as complete
// When I click “Clear Completed”
// Then the completed todo item is removed from my todo list
// And the todo item is moved to the Completed list


// Import Playwright's test and expect modules
import { test, expect } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage} from '../src/todo-app';

// Describe block
test.describe('TodoMVC - Clear completed todo item', () => {

    const TODO_ITEMS = [
        'Active todo item 1',
        'Complete this todo item',
        'Active todo item 2'
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('https://todomvc.com/examples/react/dist');

        // Create new todo items
        const newTodo = page.getByPlaceholder('What needs to be done?');
        for (const item of TODO_ITEMS) {
            await newTodo.fill(item);
            await newTodo.press('Enter');
        }

        // Mark the second item as completed
        const secondTodoToggle = page.locator('.toggle').nth(1); 
        await secondTodoToggle.click();

        // Verify the items have been added
        const todoItems = page.getByTestId('todo-item-label');
        await expect(todoItems).toHaveText(TODO_ITEMS);
        // await checkNumberOfTodosInLocalStorage(page, TODO_ITEMS.length);
        // await checkNumberOfCompletedTodosInLocalStorage(page, 1);    
    });

    test('should remove the completed todo item from the list when "Clear Completed" is clicked', async ({ page }) => {
        // Click the "Clear Completed" button
        const clearCompletedButton = page.locator('button.clear-completed');
        await clearCompletedButton.click();

        // Verify that the completed todo item is removed from the list
        const todoItems = page.getByTestId('todo-item-label');

        // Verify that only active (not completed) items are in the list
        const activeItems = [
            'Active todo item 1',
            'Active todo item 2'
        ];

        // Click the "Active" button
        const activeButton = page.locator('a', { hasText: 'Active' });
        await activeButton.click();

        for (const item of activeItems) {
            await page.waitForSelector('.todo-list li .view label');
            const todoItem = page.locator('.todo-list li .view label', { hasText: item });
            await expect(todoItem).toBeVisible();
        }

        // Verify that completed items are not shown in the list
        const completedItem = todoItems.locator('.view label', { hasText: 'Complete this todo item' });
        await expect(completedItem).toHaveCount(0);

        // Leverage helper function to confirm the completed item is removed from local storage
        // await checkNumberOfCompletedTodosInLocalStorage(page, 0);
        // await checkNumberOfTodosInLocalStorage(page, activeItems.length);
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
        // await checkNumberOfTodosInLocalStorage(page, 0);
    });
});
