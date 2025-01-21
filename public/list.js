document.addEventListener('DOMContentLoaded', () => {
    fetch('/getFiles')
      .then(response => response.json())
      .then(files => {
        const filesList = document.getElementById('files');
        files.forEach(file => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = `/uploads/${file}`;
          link.textContent = file;
          link.download = file;
          listItem.appendChild(link);
          filesList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error fetching files:', error));
  });
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '/share';
  });