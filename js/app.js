let db;

async function initDB() {
    db = new DB();
    await db.open();
}

async function loadCSV() {
    const response = await fetch('data/initial_data.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = header.trim() === 'age' ? parseInt(values[index]) : values[index].trim();
            return obj;
        }, {});
    });

    return data;
}

async function initializeData() {
    const data = await loadCSV();
    await db.clear();
    await db.addMany(data);
    alert('Data initialized from CSV');
    displayData();
}

async function displayData() {
    const people = await db.getAll();
    content.innerHTML = '';
    people.forEach(person => {
        const p = document.createElement('p');
        p.textContent = `Name: ${person.name}, Age: ${person.age}`;
        content.appendChild(p);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await initDB();

    const initDataButton = document.getElementById('initData');
    const addForm = document.getElementById('addForm');
    const loadDataButton = document.getElementById('loadData');
    const content = document.getElementById('content');

    initDataButton.addEventListener('click', initializeData);

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value;
        const age = parseInt(document.getElementById('ageInput').value);
        await db.add({ name, age });
        addForm.reset();
        alert('Person added successfully!');
        displayData();
    });

    loadDataButton.addEventListener('click', displayData);
});