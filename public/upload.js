document.getElementById('upload').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileIn = document.getElementById('file');
    const file = fileIn.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('File uploaded successfully');
            fileIn.value = ''; // Clear the file input field
        })
        .catch((error) => {
            console.error('Error: ' + error);
        });
    } else {
        alert('No file selected');
    }
});

document.getElementById('list').addEventListener('click', function() {
    window.location.href = '/list.html';
});