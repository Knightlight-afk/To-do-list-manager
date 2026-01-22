// --- UTILITY FUNCTIONS ---

function getTasks() {
    const tasks = localStorage.getItem('myTodoList');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('myTodoList', JSON.stringify(tasks));
}

function generateId() {
    return Date.now().toString();
}

// --- PAGE SPECIFIC LOGIC ---

// 1. HOME PAGE LOGIC (Display Lists)
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');

if (pendingList && completedList) {
    const tasks = getTasks();

    // Clear lists first to prevent duplicates
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        
        // Add specific class if finished for styling
        if (task.completed) {
            li.classList.add('finished-item');
        }

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" 
                    onclick="toggleTask('${task.id}')" 
                    ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <div>
                <a href="edit.html?id=${task.id}" class="btn btn-warning">Edit</a>
                <button onclick="deleteTask('${task.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;

        // Sort into the correct list
        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });

    // Messages if empty
    if (pendingList.children.length === 0) pendingList.innerHTML = '<p style="color:#ccc; font-size:12px;">No pending tasks.</p>';
    if (completedList.children.length === 0) completedList.innerHTML = '<p style="color:#ccc; font-size:12px;">No finished tasks.</p>';
}

// Toggle Completed Status
function toggleTask(id) {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        // Flip the true/false value
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        window.location.reload(); // Refresh to move the item
    }
}

// --- UPDATED DELETE FUNCTION ---
function deleteTask(id) {
    // Show a confirmation popup
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    
    // Only delete if the user clicked "OK"
    if (confirmDelete) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        window.location.reload();
    }
}

// 2. ADD PAGE LOGIC
const addForm = document.getElementById('add-form');
if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('new-task');
        if (input.value.trim() === '') return;

        const tasks = getTasks();
        // New tasks are always "completed: false"
        tasks.push({ id: generateId(), text: input.value, completed: false });
        saveTasks(tasks);

        window.location.href = 'index.html';
    });
}

// 3. EDIT PAGE LOGIC
const editForm = document.getElementById('edit-form');
if (editForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const input = document.getElementById('edit-task');

    if (taskIndex > -1) {
        input.value = tasks[taskIndex].text;
    } else {
        alert('Task not found!');
        window.location.href = 'index.html';
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim() === '') return;

        tasks[taskIndex].text = input.value;
        saveTasks(tasks);
        window.location.href = 'index.html';
    });
}