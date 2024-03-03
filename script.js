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

        const numChildren = Math.floor(Math.random() * maxChildren + 1);
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
        folders = generateFolderStructure('Root', 10, 8),
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

        const   openArrow = document.createElement('i');
                openArrow.className = 'open_arrow';
                openArrow.style.transform = 'rotateZ(90deg)';


        if(child?.children?.length < 1){
            openArrow.style.pointerEvents = 'none';
            folderName.style.cursor = 'not-allowed'
            folderName.style.opacity = '.5'
        }

        folderName.innerHTML += child?.name.split('>').pop() + ((child.type === 'dir') ? '' : `.${child.type}`);
        folderName.classList.add('folder');

        switch(child.type){
            case 'dir':
                folderName.appendChild(openArrow);
                folderName.classList.add('smallDir');
                break;
            case 'png':
                folderName.classList.add('smallPng');
                break;
            case 'mp3':
                folderName.classList.add('smallMp3');
                break;
        }

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
 
                span.addEventListener('click', (e) => {
                    console.log(e.target.textContent)
                    console.log(child.name)

                    console.log(e.target.textContent.includes(child.name))
                })
                
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
            
            console.log(sublist?.style.display)

            if(!sublist?.style.display){
                sublist.style.display = 'block'
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


let timeoutId;

folderStructure.addEventListener('scroll', (e) => {

    if(timeoutId){
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    const parent = e.target.closest('.folder_structure')


    if(parent){
        parent.style.scrollbarWidth = 'auto';

        timeoutId = setTimeout(() => {
            parent.style.scrollbarWidth = 'none';
        }, 1500)
    }
})

// хлебные крошки
// активная папка
// стилизация
// переход по папкам в main