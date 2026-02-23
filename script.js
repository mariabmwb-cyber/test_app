class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.render();
        this.updateStats();
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('addButton').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        document.getElementById('filterAll').addEventListener('click', () => this.filterTasks('all'));
        document.getElementById('filterActive').addEventListener('click', () => this.filterTasks('active'));
        document.getElementById('filterCompleted').addEventListener('click', () => this.filterTasks('completed'));
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        if (taskText) {
            this.tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            this.saveTasks();
            this.render();
            this.updateStats();
        }
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    toggleCompletion(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    filterTasks(criteria) {
        this.render(criteria);
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        document.getElementById('stats').innerText = `Total: ${total} | Completed: ${completed}`;
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    render(filter = 'all') {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        this.tasks.forEach((task, index) => {
            if (filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed)) {
                const taskItem = document.createElement('li');
                taskItem.innerText = task.text;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => this.toggleCompletion(index));
                taskItem.prepend(checkbox);
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => this.deleteTask(index));
                taskItem.append(deleteButton);
                taskList.append(taskItem);
            }
        });
    }
}

window.onload = () => new TodoApp();