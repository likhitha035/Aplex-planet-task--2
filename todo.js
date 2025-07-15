document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const remainingCount = document.getElementById('remainingCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    function init() {
        renderTodos();
        updateRemainingCount();
    
        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTodo();
        });
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTodos();
            });
        });
        clearCompletedBtn.addEventListener('click', clearCompleted);
    }
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            updateRemainingCount();
        }
    }
    function renderTodos() {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks found';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#888';
            todoList.appendChild(emptyMessage);
            return;
        }
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = todo.id;
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <button class="delete-btn">×</button>
            `;
            const checkbox = li.querySelector('.todo-checkbox');
            const deleteBtn = li.querySelector('.delete-btn');
            const todoText = li.querySelector('.todo-text');
            checkbox.addEventListener('change', function() {
                todo.completed = this.checked;
                todoText.classList.toggle('completed', this.checked);
                saveTodos();
                updateRemainingCount();
            });
            deleteBtn.addEventListener('click', function() {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
                updateRemainingCount();
            });
            todoList.appendChild(li);
        });
    }
    function updateRemainingCount() {
        const count = todos.filter(todo => !todo.completed).length;
        remainingCount.textContent = count;
    }
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    init();
});