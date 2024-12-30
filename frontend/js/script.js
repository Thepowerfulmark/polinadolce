const mediaFolder = '/media'; 
const mediaContainer = document.getElementById('media-container'); 


function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, count);
}

function getRandomPosition(container) {
    const containerRect = container.getBoundingClientRect();
    const x = Math.random() * (containerRect.width * 1); 
    const y = Math.random() * (containerRect.height * 1); 
    return {
        x: x + containerRect.width * 0.1, 
        y: y + containerRect.height * 0.1 
    };
}

function createMediaElement(fileName) {
    const filePath = `${mediaFolder}/${fileName}`;
    const mediaElement = document.createElement('div');
    mediaElement.classList.add('media-item');

    const isVideo = fileName.endsWith('.mp4') || fileName.endsWith('.webm');
    let childElement;

    if (isVideo) {
        childElement = document.createElement('video');
        childElement.src = filePath;
        childElement.autoplay = true;
        childElement.loop = true;
        childElement.muted = true;
    } else {
        childElement = document.createElement('img');
        childElement.src = filePath;
        childElement.alt = 'Media file';
    }

    const position = getRandomPosition(mediaContainer); 
    mediaElement.style.left = `${position.x}px`;
    mediaElement.style.top = `${position.y}px`;

    mediaElement.appendChild(childElement);
    return mediaElement;
}


function randomizePositionOnHover(mediaElement) {
    const position = getRandomPosition(mediaContainer); 
    mediaElement.style.left = `${position.x}px`;
    mediaElement.style.top = `${position.y}px`;
    mediaElement.classList.add('moving');
    
   
    setTimeout(() => {
        mediaElement.classList.remove('moving');
    }, 100000000000);  //милисеконд не работает
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
     
        const response = await fetch('/list-media-files');
        const files = await response.json();

    
        const centerContainer = document.getElementById('media-container');
        if (centerContainer) {
            const randomFilesCenter = getRandomItems(files, 7); 
            centerContainer.innerHTML = ''; 
            randomFilesCenter.forEach(file => {
                const mediaElement = createMediaElement(file);
                centerContainer.appendChild(mediaElement);

           
                mediaElement.addEventListener('mouseenter', () => {
                    randomizePositionOnHover(mediaElement);
                });
            });
        } else {
            console.error('Центральный контейнер с id "media-container" не найден.');
            alert('Ошибка при загрузке медиафайлов!');
        }

        const buttons = document.querySelectorAll('.container .option');
        if (buttons.length > 0) {
            const randomFilesForButtons = getRandomItems(files, buttons.length);
            buttons.forEach((button, index) => {
                const randomFile = randomFilesForButtons[index];
                if (randomFile) {
                    const isVideo = randomFile.endsWith('.mp4') || randomFile.endsWith('.webm');
                    let mediaElement;

                    if (isVideo) {
                        mediaElement = document.createElement('video');
                        mediaElement.src = `${mediaFolder}/${randomFile}`;
                        mediaElement.autoplay = true;
                        mediaElement.loop = true;
                        mediaElement.muted = true;
                        mediaElement.alt = 'media_video';
                    } else {
                        mediaElement = document.createElement('img');
                        mediaElement.src = `${mediaFolder}/${randomFile}`;
                        mediaElement.alt = 'media_img';
                    }

                    const textSpan = button.querySelector('span'); 
                    button.innerHTML = ''; 
                    button.appendChild(mediaElement); 
                    if (textSpan) button.appendChild(textSpan); 
                } else {
                    console.warn(`Не найден медиафайл для кнопки ${index}`);
                }
            });
        } else {
            console.warn('Кнопки с изображениями не найдены.');
        }

        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.opacity = '0'; 
                item.style.pointerEvents = 'none'; 
            });

            item.addEventListener('mouseleave', () => {
                item.style.opacity = '1'; 
                item.style.pointerEvents = 'auto'; 
            });
        });
    } catch (error) {
        console.error('Ошибка загрузки медиафайлов:', error);
        alert('Ошибка при загрузке медиафайлов!');
    }
});
