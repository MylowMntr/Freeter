const { ipcRenderer } = require('electron');

document.getElementById('data-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const key = document.getElementById('key').value;
    const data = document.getElementById('data').value;

    // Envoyer les données au processus principal
    await ipcRenderer.invoke('save-mongo-data', { key, data });

    // Réinitialiser le formulaire
    event.target.reset();

    // Mettre à jour la liste des données
    loadData();
});

async function loadData() {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = '';

    // Récupérer les données du processus principal
    const data = await ipcRenderer.invoke('get-mongo-data');

    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.key}: ${item.data}`;
        dataList.appendChild(li);
    });
}

// Charger les données au démarrage
loadData();
