import { access, readFile, writeFile } from 'node:fs/promises';

type Task = {
    id: number;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
    updatedAt: string;
}

type TaskList = {
    tasks: Task[];
    lastIdCreated: number;
}

const filePath = './task-list.json';

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
    return err instanceof Error && "code" in err;
}

function isTaskList(value: unknown): value is TaskList {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    if (!("tasks" in value) || !("lastIdCreated" in value)) {
        return false;
    }
    return Array.isArray(value.tasks) && typeof value.lastIdCreated === "number";
}

async function checkTaskListExists(): Promise<boolean> {
    try {
        await access(filePath);
        return true;
    } catch (err) {
        if (isNodeError(err) && err.code === "ENOENT") {
            return false;
        } else {
            throw err;
        }
    }
}

async function createTaskListFile(): Promise<void> {
    const blankTaskList: TaskList = {
        tasks: [],
        lastIdCreated: 0
    };
    await writeFile(filePath, JSON.stringify(blankTaskList), 'utf8');
}

async function loadTaskList() {
    const text = await readFile(filePath, 'utf8');
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch (err) {
        throw new Error("Task list file is not valid JSON. The file was not modified.", {cause: err});
    }
    if (!isTaskList(parsed)) {
        throw new Error("Task list file has an unexpected shape. The file was not modified.");
    }
    return parsed;
}

const action = process.argv[2];
const actionArg1 = process.argv[3];
const actionArg2 = process.argv[4];

const now: Date = new Date();
const currentDateTime = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}).format(now);
const validStatuses = new Set(["todo", "in-progress", "done"]);

switch (action) {
    case "add":
        {
            if (!actionArg1) {
                console.log("Description required");
                break;
            }
            const exists = await checkTaskListExists();
            if (!exists) {
                await createTaskListFile();
            }
            const taskList = await loadTaskList();
            
            const newTaskId = (taskList.lastIdCreated + 1);
            const newTask: Task = {
                id: newTaskId,
                description: actionArg1,
                status: 'todo',
                createdAt: String(currentDateTime),
                updatedAt: String(currentDateTime),
            }
            taskList.tasks.push(newTask);
            taskList.lastIdCreated = newTaskId;
            await writeFile(filePath, JSON.stringify(taskList), 'utf8');
            console.log("Task added successfully (ID: " + newTaskId + ")");
            break;
        }
    case "update":
        {
            const exists = await checkTaskListExists();
            const actionArg1Num = Number(actionArg1);
            if (actionArg1 && (Number.isNaN(actionArg1Num) || actionArg1Num <= 0 || !Number.isInteger(actionArg1Num))){
                console.log("Task ID must be a whole, positive integer.");
                break;
            } else if (!actionArg1) {
                console.log("Task ID required");
                break;
            } else if (!actionArg2) {
                console.log("Task description required");
                break;
            } else if (!exists) {
                console.log("No tasks exist yet. Create one to get started.")
                break;
            }
            const taskList = await loadTaskList();
            const selectedTask = taskList.tasks.find(task => task.id === actionArg1Num);
            const selectedTaskIndex = taskList.tasks.findIndex(task => task.id === actionArg1Num);
            if (selectedTask) {
                selectedTask.description = actionArg2;
                selectedTask.updatedAt = String(currentDateTime);
                taskList.tasks[selectedTaskIndex] = selectedTask;
                await writeFile(filePath, JSON.stringify(taskList), 'utf8');
                console.log("Task updated successfully (ID: " + selectedTask.id + ")");
                break;
            } else {
                console.log("Task ID not found")
                break;
            }
        }
    case "delete":
        {
            const exists = await checkTaskListExists();
            const actionArg1Num = Number(actionArg1);
            if (actionArg1 && (Number.isNaN(actionArg1Num) || actionArg1Num <= 0 || !Number.isInteger(actionArg1Num))){
                console.log("Task ID must be a whole, positive integer.");
                break;
            } else if (!actionArg1) {
                console.log("Task ID required");
                break;
            } else if (!exists) {
                console.log("No tasks exist yet. Create one to get started.")
                break;
            }
            const taskList = await loadTaskList();
            const selectedTask = taskList.tasks.find(task => task.id === actionArg1Num);
            const selectedTaskIndex = taskList.tasks.findIndex(task => task.id === actionArg1Num);
            if (selectedTask) {
                taskList.tasks.splice(selectedTaskIndex, 1);
                await writeFile(filePath, JSON.stringify(taskList), 'utf8');
                console.log("Task deleted successfully (ID: " + selectedTask.id + ")");
                break;
            } else {
                console.log("Task ID not found")
                break;
            }
        }
    case "mark-in-progress":
        {
            const exists = await checkTaskListExists();
            const actionArg1Num = Number(actionArg1);
            if (actionArg1 && (Number.isNaN(actionArg1Num) || actionArg1Num <= 0 || !Number.isInteger(actionArg1Num))){
                console.log("Task ID must be a whole, positive integer.");
                break;
            } else if (!actionArg1) {
                console.log("Task ID required");
                break;
            } else if (!exists) {
                console.log("No tasks exist yet. Create one to get started.")
                break;
            }
            const taskList = await loadTaskList();
            const selectedTask = taskList.tasks.find(task => task.id === actionArg1Num);
            const selectedTaskIndex = taskList.tasks.findIndex(task => task.id === actionArg1Num);
            if (selectedTask) {
                taskList.tasks[selectedTaskIndex].status = "in-progress";
                taskList.tasks[selectedTaskIndex].updatedAt = String(currentDateTime);
                await writeFile(filePath, JSON.stringify(taskList), 'utf8');
                console.log("Task status updated successfully (ID: " + selectedTask.id + ")");
                break;
            } else {
                console.log("Task ID not found")
                break;
            }
        }
    case "mark-done":
        {
            const exists = await checkTaskListExists();
            const actionArg1Num = Number(actionArg1);
            if (actionArg1 && (Number.isNaN(actionArg1Num) || actionArg1Num <= 0 || !Number.isInteger(actionArg1Num))){
                console.log("Task ID must be a whole, positive integer.");
                break;
            } else if (!actionArg1) {
                console.log("Task ID required");
                break;
            } else if (!exists) {
                console.log("No tasks exist yet. Create one to get started.")
                break;
            }
            const taskList = await loadTaskList();
            const selectedTask = taskList.tasks.find(task => task.id === actionArg1Num);
            const selectedTaskIndex = taskList.tasks.findIndex(task => task.id === actionArg1Num);
            if (selectedTask) {
                taskList.tasks[selectedTaskIndex].status = "done";
                taskList.tasks[selectedTaskIndex].updatedAt = String(currentDateTime);
                await writeFile(filePath, JSON.stringify(taskList), 'utf8');
                console.log("Task status updated successfully (ID: " + selectedTask.id + ")");
                break;
            } else {
                console.log("Task ID not found")
                break;
            }
        }
    case "list":
        {
            const exists = await checkTaskListExists();
            if (actionArg1 && !validStatuses.has(actionArg1)) {
                console.log("Status filter must be todo, in-progress, or done.")
                break;
            } else if (!exists) {
                console.log("No tasks exist yet. Create one to get started.")
                break;
            }
            const taskList = await loadTaskList();
            if (!actionArg1) {
                if (taskList.tasks.length === 0) {
                    console.log("No tasks exist yet. Create one to get started.")
                    break;
                } else {
                    console.log(taskList.tasks);
                    break;
                }
            } else {
                const filteredTaskList = taskList.tasks.filter(task => task.status === actionArg1);
                if (filteredTaskList.length === 0) {
                    console.log("No tasks exist for that status.")
                } else {
                    console.log(filteredTaskList);
                }
                break;
            }
        }
    default:
        {
            console.log("Action not supported. Please use add, update, delete, mark-in-progress, mark-done, or list and appropriate arguments.");
            break;
        }
}