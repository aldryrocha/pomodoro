const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBTn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textarea = document.querySelector('.app__form-textarea');
const cancelTask = document.querySelector('.app__form-footer__button--cancel');
const deleteTask = document.querySelector('.app__form-footer__button--delete');
const taskAtiveDescription = document.querySelector('.app__section-active-task-description');
const localStoreTarefas = localStorage.getItem('tarefas');

const AllTasksDelete = document.querySelector('#btn-remover-todas');
const AllConcludeTasksDelete = document.querySelector('#btn-remover-concluidas');
/* SOLUÇÃO PROFESSOR:
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
 */

let tarefas = localStoreTarefas ? JSON.parse(localStoreTarefas) : []
//JSON.parse() para a string e transforma de volta em objeto

const taskIconSVG = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#FFF" /><path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E" /></svg>`;

let selectTasks = null; //tarefaSelecionada 
let tasksItemSelect = null; //itemTarefaSelecionada 

let tarefaEmEdicao = null;
let paragraphEmEdicao = null;

const selectTask = (tarefa, elemento) => {
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })
    
    if (selectTasks == tarefa) {
        taskAtiveDescription.textContent = null
        tasksItemSelect = null
        selectTasks = null
        return
    }
    
    selectTasks = tarefa
    tasksItemSelect = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const clearForm = () => {
    tarefaEmEdicao = null;
    paragraphEmEdicao = null;
    textarea.value = '';
    formTask.classList.add('hidden');
}

const selectTaskToEdit = (tarefa, elemento) => {
    if(tarefaEmEdicao == tarefa){
        clearForm();
        return;
    }
    formLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragraphEmEdicao = elemento;
    textarea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
}

cancelTask.addEventListener('click', clearForm);

deleteTask.addEventListener('click', () => {
    if(selectTasks){
        const index = tarefas.indexOf(selectTasks); //quer achar a posição da tarefa dentro da lista para removê-la
        if(index !== -1){
            tarefas.splice(index, 1);//remove tarefa do index
        }
        tasksItemSelect.remove();
        tarefas.filter(t=> t!= selectTasks); //criando um novo array sem a tarefa que foi removida
        tasksItemSelect = null;//quando deleta uma, nao quer que nenhuma tarefa fique selecionada
        selectTasks = null;//quando deleta uma, nao quer que nenhuma tarefa fique selecionada
    }
    updateLocalStorage();
    clearForm();
})

/* SOLUÇÃO PROFESSOR:
 cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')
}
btn.Cancelar.addEventListener('click', clearForm)
*/

function createTask(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSVG;

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;
    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png');
    button.appendChild(editIcon);

    li.onclick = () => {
        selectTask(tarefa, li);        
    }
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selectTaskToEdit(tarefa, paragraph);
    })

    svgIcon.addEventListener('click', (event) => {
        if(tarefa == selectTasks){
            event.stopPropagation();
            button.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            selectTasks.concluida = true;
            updateLocalStorage();
        }        
    })
    if(tarefa.concluida){
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    }

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
}
tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
})

toggleFormTaskBTn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa';
    formTask.classList.toggle('hidden');
})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); //JSON.stringify estamos transformando dados em strong para subir para o localStorage
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if(tarefaEmEdicao){
        tarefaEmEdicao.descricao = textarea.value;
        paragraphEmEdicao.textContent = textarea.value;
    } else{
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tarefas.push(task);//manda a tarefa para o array, mostrando na tela
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }
    updateLocalStorage();
    clearForm();
})

document.addEventListener('TarefaFinalizada', function(e){
    if(selectTasks){
        selectTasks.concluida = true;
        tasksItemSelect.classList.add('app__section-task-list-item-complete');
        tasksItemSelect.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
})

/* MY WAY
AllTasksDelete.addEventListener('click', () => {
    taskListContainer.remove();
    tarefas.length = 0;
    localStorage.clear();
    clearForm();
})

AllConcludeTasksDelete.addEventListener('click', () => {
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.remove();
    })
    tarefas = tarefas.filter(task => task.concluida != true);    
    updateLocalStorage();
    clearForm();
})*/
/* PROFESSOR WAY */
const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

AllConcludeTasksDelete.addEventListener('click', () => removerTarefas(true))
AllTasksDelete.addEventListener('click', () => removerTarefas(false))