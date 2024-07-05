class DB {
    constructor() {
        this.db = null;
        this.open();
    }

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MyDatabase', 1);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('people', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('age', 'age', { unique: false });
            };
        });
    }

    add(data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['people'], 'readwrite');
            const objectStore = transaction.objectStore('people');
            const request = objectStore.add(data);
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }

    addMany(dataArray) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['people'], 'readwrite');
            const objectStore = transaction.objectStore('people');
            
            dataArray.forEach(data => {
                objectStore.add(data);
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['people'], 'readonly');
            const objectStore = transaction.objectStore('people');
            const request = objectStore.getAll();
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['people'], 'readwrite');
            const objectStore = transaction.objectStore('people');
            const request = objectStore.clear();
            request.onerror = (event) => reject(event.target.error);
            request.onsuccess = (event) => resolve();
        });
    }
}