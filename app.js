// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarText = document.getElementById('progress-bar-text');

    // Carga tareas o inicia vacío
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateProgressBar = () => {
        const total = tasks.length;
        if (!total) {
            progressBarFill.style.width = '0%';
            progressBarText.textContent = '0%';
            return;
        }
        const done = tasks.filter(t => t.completed).length;
        const percent = Math.round((done / total) * 100);
        progressBarFill.style.width = `${percent}%`;
        progressBarText.textContent = `${percent}%`;
        // Ajusta color según porcentaje
        if (percent < 30) progressBarFill.style.backgroundColor = '#dc3545';
        else if (percent < 70) progressBarFill.style.backgroundColor = '#ffc107';
        else progressBarFill.style.backgroundColor = '#28a745';
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            if (task.completed) li.classList.add('completed');

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            // Texto
            const span = document.createElement('span');
            span.textContent = task.text;

            // Botón Eliminar con icono de papelera convencional
            const delBtn = document.createElement('button');
            delBtn.setAttribute('aria-label', 'Eliminar tarea');
            delBtn.style.background = 'none';
            delBtn.style.border = 'none';
            delBtn.style.padding = '0';
            delBtn.style.cursor = 'pointer';
            delBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E53935">
                    <path d="M9 3v1H4v2h16V4h-5V3H9z"/>
                    <path d="M5 8v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8H5z"/>
                    <path d="M8 10h2v9H8v-9z"/>
                    <path d="M12 10h2v9h-2v-9z"/>
                    <path d="M16 10h2v9h-2v-9z"/>
                </svg>`;
            delBtn.addEventListener('click', () => deleteTask(task.id));

            li.append(checkbox, span, delBtn);
            taskList.appendChild(li);
        });
        updateProgressBar();
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (!text) return alert('Por favor, escribe una tarea.');
        tasks.push({ id: Date.now(), text, completed: false });
        taskInput.value = '';
        saveTasks(); renderTasks();
    };

    const toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        saveTasks(); renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(); renderTasks();
    };

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });

    // Inicializa UI
    renderTasks();
});