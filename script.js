const aside = document.querySelector('.aside');
const main = document.querySelector('.main');
const trigger = document.querySelector('.pane_trigger');
let isResizing = false;
let startX, initialWidth;


trigger.addEventListener('mousedown', startResize);
document.addEventListener('mouseup', stopResize);
document.addEventListener('mousemove', resize);

function startResize(event) {
    isResizing = true;
    startX = event.pageX;
    initialWidth = aside.offsetWidth;
    event.preventDefault();

    trigger.classList.add('active');
}

function resize(event) {
    if (isResizing) {
        const newWidth = Math.min(Math.max(initialWidth + (event.pageX - startX), 250), 500);
        aside.style.width = newWidth + 'px'
        main.style.width = `calc(100% - ${newWidth}px)`

        trigger.style.left = `calc(${newWidth}px - 4px)`
    }
}

function stopResize() {
    isResizing = false;
    trigger.classList.remove('active');
}

function getRandomFileType(){
    const types = ['png', 'mp3', 'dir'];

    return types[Math.floor(Math.random() * types.length)]
}

function generateRandomString(length, useNumbers) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + (useNumbers ? '0123456789' : '');
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  

function generateFolderStructure(rootFolder = 'Root', depth = 3, maxChildren = 4) {

    const generateFolders = (folder, currentDepth) => {
        if (currentDepth >= depth) {
            return [];
        }

        const numChildren = Math.floor(Math.random() * maxChildren);
        const children = Array.from({ length: numChildren }, (_, index) => {
            const childName = `${folder} > ${generateRandomString(6, true)}`;
            const child = {
                name: childName,
                type: getRandomFileType()
            }

            if(child.type === 'dir'){
                child.children = generateFolders(childName, currentDepth + 1)
            }

            return child
        })

        return children;
    }

    return {
        name: rootFolder,
        children: generateFolders(rootFolder, 0),
        type: 'dir'
    }
}


const   folderStructure = document.querySelector('.folder_structure'),
        folders = generateFolderStructure('Root', 4, 6),
        folderPath = document.querySelector('.folder_path'),
        childrenFolders = document.querySelector('.children_folders'),
        folderNames = document.querySelector('.folders-names'),
        structureContainer = document.querySelector('.structure-container');
        
        
function createFolderView(data, parentElement){
    const ul = document.createElement('ul');
    parentElement.appendChild(ul);

    data?.children.forEach(child => {
        const li = document.createElement('li');
        ul.appendChild(li);

        const folderName = document.createElement('span');
        folderName.style.display = 'inline-block';

        const openArrow = document.createElement('i');
        openArrow.className = 'open_arrow';
        openArrow.style.transform = 'rotateZ(0deg)';

        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.backgroundImage = 'url("./src/img/yellow-folder.svg")';

        
        if(child.type === 'dir'){
            folderName.appendChild(openArrow);
            folderName.appendChild(icon)
        }

        if(child?.children?.length < 1){
            openArrow.style.pointerEvents = 'none';
            folderName.style.cursor = 'not-allowed'
            folderName.style.opacity = '.5'
        }

        folderName.innerHTML += child?.name.split('>').pop() + ((child.type === 'dir') ? '' : `.${child.type}`);
        folderName.className = 'folder';

        folderName.addEventListener('dblclick', (e) => {

            e.target.parentElement.classList.add('active');

            parentElement.querySelectorAll('.active').forEach(item => {
                if(item != e.target.parentElement){
                    item.classList.remove('active');
                }
            })

            console.log(child?.children)

            folderPath.innerHTML  = "";

            const   children = child?.children,
                    folderPathNames = child.name.split(' > ');

            folderPathNames.forEach(name => {

                const span = document.createElement('span');
                span.textContent = name + " > ";
                folderPath.appendChild(span)
 
                // let a;

                // span.addEventListener('click', (e) => {
                //     structureContainer.innerHTML = '';
                //     // const newSpan = span.textContent.replace(/\s*>\s*/g, ''); 
                //     a = children;
                //     console.log(e.target)
                //     console.log(a)
                //     // children.forEach(el => {
                //     //     const li = document.createElement('li');
                //     //     li.textContent = el.name;
                //     //     structureContainer.appendChild(li);
                //     // })   
                // })
            })

            structureContainer.innerHTML = '';

            if(children?.length > 0){
                const files = children.filter(el => el.type !== 'dir'),
                      folders = children.filter(el => el.type === 'dir');

                structureContainer.innerHTML = '';

                children.sort((a, b) => a.name.localeCompare(b.name))

                if(folders.length > 0){
                    const childrenFolders = document.createElement('ul');
                    childrenFolders.classList.add('folders_structure');

                    folders.forEach((childrenItem) => {
                        const childrenLength = childrenItem.children?.length;
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <div class="folder_bg"></div>
                            <div class="folder_text">
                                <h1>${childrenItem.name.split(">").pop()}</h1>
                                <h2>${childrenLength > 1 ? `Item's ${childrenLength}` : `Item ${childrenLength}`}</h2>
                            </div>
                        `;

                        childrenFolders.appendChild(li);
                    })

                    structureContainer.appendChild(childrenFolders)
                }

                if(files.length > 0){
                    const childrenFiles = document.createElement('ul');
                    childrenFiles.classList.add('files_structure');

                    files.forEach((childrenItem) => {
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <div class="${childrenItem.type === 'mp3' ? 'mp3' : 'png'}"></div>
                            <h1>${childrenItem.name.split(">").pop() + `.${childrenItem.type}`}</h1>
                        `;

                        childrenFiles.appendChild(li);
                    })

                    structureContainer.appendChild(childrenFiles)
                }
            }
        })
      
        li.appendChild(folderName);

        if(child?.children?.length > 0){
            createFolderView(child, li);
        }

        li.querySelector('i')?.addEventListener('click', () => {
            const sublist = li.querySelector('ul'),
                arrow = li.querySelector('i');
            
            if(!sublist?.style){
                sublist.style.display = 'none'
            }

            if(sublist){
                sublist.style.display = (sublist.style.display === 'block') ? 'none' : 'block';
                arrow.style.transform = (arrow.style.transform === 'rotateZ(0deg)') ? 'rotateZ(90deg)' : 'rotateZ(0deg)';
            }
        })
    });
}


const createBtn = document.getElementById('create');

console.log(folders)

createBtn.addEventListener('click', (e) => {
    createFolderView(folders, folderStructure);
    e.target.remove()
    folderNames.style.display = 'flex';
});






// обработать двойной клик по папке, вывовдить в main полный путь к папке, присвоить класс
// вывести все вложенные в нее папки




// Рабочие хлебные крошки - написать функцию, которая находит папку по полному адресу и возвращает все дочерние элементы
// Разделить файлы и папки на 2 контейнера (1 папка по ширине минимум как 2 файла)
// Для папки выводить количество элементов (дочерних item/s)
// Выделения активной папки в списке

// Иконки в списке папок и файлов
// Привести дизайн к референсу