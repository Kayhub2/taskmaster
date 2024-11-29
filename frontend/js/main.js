document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchForm = document.getElementById('searchForm');
    const feedback = document.getElementById('feedback');

    const showFeedback = (message, type = 'success') => {
        if (feedback) {
            feedback.textContent = message;
            feedback.className = type;
            setTimeout(() => {
                feedback.textContent = '';
                feedback.className = '';
            }, 3000);
        }
    };

    const addTaskToList = (task) => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - ${task.priority} - ${task.deadline}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                li.remove();
                showFeedback('Task deleted successfully');
            } else {
                console.error('Task deletion failed');
                showFeedback('Task deletion failed', 'error');
            }
        });
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('http://localhost:8081/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = '/tasks';
                showFeedback('Registration successful');
            } else {
                console.error('Registration failed');
                showFeedback('Registration failed', 'error');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('http://localhost:8081/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = '/tasks';
                showFeedback('Login successful');
            } else {
                console.error('Login failed');
                showFeedback('Login failed', 'error');
            }
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const deadline = document.getElementById('deadline').value;
            const priority = document.getElementById('priority').value;

            const response = await fetch('http://localhost:8081/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, deadline, priority })
            });

            if (response.ok) {
                const task = await response.json();
                addTaskToList(task);
                taskForm.reset();
                showFeedback('Task added successfully');
            } else {
                console.error('Task creation failed');
                showFeedback('Task creation failed', 'error');
            }
        });

        const loadTasks = async () => {
            const response = await fetch('http://localhost:8081/api/tasks', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                const tasks = await response.json();
                tasks.forEach(addTaskToList);
            } else {
                console.error('Failed to load tasks');
                showFeedback('Failed to load tasks', 'error');
            }
        };

        loadTasks();
    }

    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('searchQuery').value;
            const priority = document.getElementById('searchPriority').value;

            const response = await fetch(`http://localhost:8081/api/tasks/search?query=${query}&priority=${priority}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                const tasks = await response.json();
                taskList.innerHTML = '';
                tasks.forEach(addTaskToList);
                showFeedback('Search completed successfully');
            } else {
                console.error('Failed to search tasks');
                showFeedback('Failed to search tasks', 'error');
            }
        });
    }
});
