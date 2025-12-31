document.addEventListener('DOMContentLoaded', () => {
    // Select DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const countDisplay = document.getElementById('countDisplay');
    const tabs = document.querySelectorAll('.tabs span');

    let tasks = JSON.parse(localStorage.getItem('myPersistentTasks')) || [];
    let currentFilter = 'All';

 

    function render() {
        taskList.innerHTML = '';
      
        const filteredTasks = tasks.filter(t => {
            if (currentFilter === 'Active') return !t.completed;
            if (currentFilter === 'Completed') return t.completed;
            return true;
        });

   
        filteredTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.text}</span>
                </div>
                <div class="actions">
                    <i class="fa-solid fa-pencil"></i>
                    <i class="fa-solid fa-trash btn-delete"></i>
                </div>
            `;

            const checkbox = item.querySelector('input');
            checkbox.addEventListener('change', () => toggleTask(task.id));

   
            const deleteIcon = item.querySelector('.btn-delete');
            deleteIcon.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(item);
        });

   
        const activeCount = tasks.filter(t => !t.completed).length;
        countDisplay.innerText = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;

       
        localStorage.setItem('myPersistentTasks', JSON.stringify(tasks));
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === "") return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = "";
        render();
    }

    function toggleTask(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        render();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        render();
    }

    function setFilter(filterName, element) {
        currentFilter = filterName;
        tabs.forEach(tab => tab.classList.remove('active'));
        element.classList.add('active');
        render();
    }

 

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });


    document.getElementById('allTab').addEventListener('click', (e) => setFilter('All', e.target));
    document.getElementById('activeTab').addEventListener('click', (e) => setFilter('Active', e.target));
    document.getElementById('completedTab').addEventListener('click', (e) => setFilter('Completed', e.target));

    render();
});