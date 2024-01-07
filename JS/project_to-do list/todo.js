document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-todo');
    const inputField = document.getElementById('todo-input');
    const todoList = document.querySelector('.todo-list');

    addButton.addEventListener('click', function () {
        const taskText = inputField.value.trim();
        if (taskText !== '') {
            addTodoItem(taskText);
            addData()
            inputField.value = '';
        }
    });

    function addTodoItem(text) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const textId = document.createElement('input');
        textId.setAttribute('hidden',true);
        textId.setAttribute('class','textid');
        textId.type = 'text';
        textId.id = Date.now();

        const checkBox = document.createElement('input');
        checkBox.setAttribute('class','checkbox');
        checkBox.type = 'checkbox';
        checkBox.addEventListener('click', function () {
            //checkbox修改的儲存行為
            const eventId = textId.id; 
            const boxChecked = checkBox.checked
            checkEditData(eventId, boxChecked);
        });

        const note = document.createElement('input');
        note.setAttribute('class','note');
        note.type = 'text';
        note.value = text;
        note.disabled = true;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.setAttribute('class','edit');
        editButton.addEventListener('click', function () {
            //打開文字編輯, 更換按鈕
            editButton.remove();
            todoItem.insertBefore(saveButton, deleteButton);
            note.disabled = false;
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.setAttribute('class','save');
        saveButton.addEventListener('click', function () {            
            //關閉文字編輯, 更換按鈕
            saveButton.remove();
            todoItem.insertBefore(editButton, deleteButton);
            note.disabled = true;
            //文字修改的儲存行為
            const eventId = textId.id; 
            const textUpdate = note.value
            noteEditData(eventId, textUpdate);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            const eventId = textId.id; 
            deleteData(eventId);
            todoItem.remove();
        });

        checkBox.addEventListener('change', function () {
            if (checkBox.checked) {
                todoItem.classList.add('completed');
            } else {
                todoItem.classList.remove('completed');
            }
        });

        todoItem.appendChild(textId);
        todoItem.appendChild(checkBox);
        todoItem.appendChild(note);
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);

        todoList.appendChild(todoItem);
    }

    function addData() {

        const eventId = document.querySelector('.todo-item:last-child .textid').id;
        const eventCheckbox = document.querySelector('.todo-item:last-child .checkbox').checked;
        const eventNote = document.querySelector('.todo-item:last-child .note').value;

        let eventData = getStorageData();

        let newEvent = {
            "id": eventId,
            "checkbox": eventCheckbox,
            "note": eventNote
        };

        eventData.events.push(newEvent);

        saveStorageData(eventData);
    }

    function deleteData(eventId) {
        let eventData = getStorageData();
        eventData.events = eventData.events.filter((eData) => {
            return eData.id != eventId;
        });
        saveStorageData(eventData);
    }

    function checkEditData(eventId, boxChecked) {
        let eventData = getStorageData();
        const foundEvent = eventData.events.find((eData) => {
            return eData.id == eventId;
        });
        foundEvent.checkbox = boxChecked;
        saveStorageData(eventData);
    }

    function noteEditData(eventId, textUpdate) {
        let eventData = getStorageData();
        const foundEvent = eventData.events.find((eData) => {
            return eData.id == eventId;
        });
        foundEvent.note = textUpdate;
        saveStorageData(eventData);
    }

    function getStorageData() {
        let eventData = localStorage.getItem('todoEvents');
        return eventData ? JSON.parse(eventData) : { events: [] };
    }

    function saveStorageData(eventData) {
        localStorage.setItem('todoEvents', JSON.stringify(eventData));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //localStorage讀取與顯示, 雖然這次比較整齊, 但前面的要重新部屬一次, 我要寫個慘字RRRRRR
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    displayStoredData();

    function displayStoredData() {
        const storedData = getStorageData();

        storedData.events.forEach((event) => {
            addTodoItemFromStorage(event.id, event.checkbox, event.note);
        });
    }

    function addTodoItemFromStorage(id, checkbox, note) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const textId = document.createElement('input');
        textId.setAttribute('hidden', true);
        textId.setAttribute('class', 'textid');
        textId.type = 'text';
        textId.id = id;

        const checkBox = document.createElement('input');
        checkBox.setAttribute('class', 'checkbox');
        checkBox.type = 'checkbox';
        checkBox.checked = checkbox;
        checkBox.addEventListener('click', function () {
            //checkbox修改的儲存行為
            const eventId = textId.id; 
            const boxChecked = checkBox.checked
            checkEditData(eventId, boxChecked);
        });

        const noteElement = document.createElement('input');
        noteElement.setAttribute('class', 'note');
        noteElement.type = 'text';
        noteElement.value = note;
        noteElement.disabled = true;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.setAttribute('class', 'edit');
        editButton.addEventListener('click', function () {
            editButton.remove();
            todoItem.insertBefore(saveButton, deleteButton);
            noteElement.disabled = false;
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.setAttribute('class', 'save');
        saveButton.addEventListener('click', function () {
            saveButton.remove();
            todoItem.insertBefore(editButton, deleteButton);
            noteElement.disabled = true;
            const eventId = textId.id;
            const textUpdate = noteElement.value;
            noteEditData(eventId, textUpdate);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            const eventId = textId.id;
            deleteData(eventId);
            todoItem.remove();
        });

        checkBox.addEventListener('change', function () {
            if (checkBox.checked) {
                todoItem.classList.add('completed');
            } else {
                todoItem.classList.remove('completed');
            }
        });

        todoItem.appendChild(textId);
        todoItem.appendChild(checkBox);
        todoItem.appendChild(noteElement);
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);

        todoList.appendChild(todoItem);
    }

});
