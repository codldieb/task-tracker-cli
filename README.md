# Task Tracker CLI
This is a cli tool to help you keep track of tasks that you need to do.
## Prerequisites
- Node version 22 or newer is needed to run this application using the provided commands.
## Task Fields
- `id`
    - This field is initialized and automatically assigned a value when a task is created.
    - The value assigned is the last assigned `id` plus 1.
- `description`
    - This field tells what a task is and is provided by the user on task creation.
    - Can also be modified using the `update` command.
- `status`
    - This field is the current status of the task.
    - Valid statuses are `todo`, `in-progress`, or `done`.
    - On task creation, `todo` is assigned as the status.
    - Status can be updated to `in-progress` or `done` using the `mark-in-progress` or `mark-done` commands.
- `createdAt`
    - This field contains the date time that the task was created.
    - The value for this field cannot be changed, once the task is created.
- `updatedAt`
    - This field contains the date time of the creation or last modification of a task (whichever is most recent).
    - At task creation, this is assigned to the current date time.
    - If a task is modified (via `update`, `mark-in-progress`, or `mark-done` commands), then the value is updated to the date time when that command is run.


Tasks are stored in `./task-list.json`, which is created if a task is added while the file doesn't exist.

In this application, a valid Task ID is considered to be a whole number greater than 0. As such the following types of IDs are considered invalid: `abc`, `0`, `-1`, and `1.5`

## Task Actions/Commands

There are several actions available associated with tasks. 
Each is listed below along with its requirements and limitations.

- `node index.ts add [Task Description]`
    - This command will add a task to the list with the Task Description provided.
    - Task status will be set to `todo`.
    - Task ID is automatically assigned based on the last assigned ID, starting at 1.
    - Task Description is required.
    - Task Description longer than one word must be in quotes.
    - Task will be added to the `task-list.json` file if it exists, if it doesn't it will create it first, then append the task to it.
    - If the command is run without a Task Description, then an error message will display letting the user know that it is required.
    - If successful, the following message will appear: `Task added successfully (ID: [ID])`
- `node index.ts update [Task ID] [Task Description]`
    - This command will update the Task Description for the task associated with the provided Task ID to the newly provided Task Description.
    - Task ID and Task Description are both required.
    - Task Description longer than one word must be in quotes.
    - If the command is run without either the Task ID or Task Description, then an error message will display letting the user know that they are required.
    - If Task ID is invalid or not found, an appropriate error message will display as well.
    - This also updates the UpdatedAt time for the task.
    - If successful, the following message will appear: `Task updated successfully (ID: [ID])`
- `node index.ts delete [Task ID]`
    - This command will remove the task associated with the provided Task ID from the task list file.
    - Task ID is required.
    - If the command is run without the Task ID, then an error message will display letting the user know that it is required.
    - Deleting a task does not alter the ID of any other current or future tasks (i.e. if the last task added has an ID of 3 and is removed, the next added task will still have an ID of 4);
    - If Task ID is invalid or not found, an appropriate error message will display as well.
    - If successful, the following message will appear: `Task deleted successfully (ID: [ID])`
- `node index.ts mark-in-progress [Task ID]`
    - This command will update the status of the task associated with the provided Task ID to `in-progress`.
    - It will also update the UpdatedAt value for the associated task.
    - Task ID is required.
    - If the command is run without the Task ID, then an error message will display letting the user know that it is required.
    - If Task ID is invalid or not found, an appropriate error message will display as well.
    - If successful, the following message will appear: `Task status updated successfully (ID: [ID])`
- `node index.ts mark-done [Task ID]`
    - This command will update the status of the task associated with the provided Task ID to `done`.
    - It will also update the UpdatedAt value for the associated task.
    - Task ID is required.
    - If the command is run without the Task ID, then an error message will display letting the user know that it is required.
    - If Task ID is invalid or not found, an appropriate error message will display as well.
    - If successful, the following message will appear: `Task status updated successfully (ID: [ID])`
- `node index.ts list [Optional: todo, in-progress, or done]`
    - This command will display the full list of tasks, if no optional argument is provided. (i.e. `node index.ts list`).
    - If an optional argument is provided (`todo`, `in-progress`, or `done`), then only the tasks currently in that status will be returned.
    - If there are no tasks, then an appropriate message is displayed letting the user know to create a task.
    - If there are no tasks currently in the provided status, then an appropriate message is displayed letting the user know that.
    - If an optional status argument is provided and is not one of `todo`, `in-progress`, or `done`, then an appropriate error message is displayed.
- `node index.ts [Any action not listed above or no argument here]`
    - If the command is run with any action not listed in the above options or without an action argument, an error message will display letting the user know which actions are supported.