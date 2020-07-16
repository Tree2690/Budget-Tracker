
let db
 // global variable for database


const request = indexedDB.open('budget', 1)
// global indexDB variable

// used to update db when changes are made
request.onupgradeneeded = event => {
  db = event.target.result

  db.createObjectStore('pending', {
    autoIncrement: true
  })
}

// tells app what to do when connected to db
request.onsuccess = event => {
  db = event.target.result

  if (navigator.onLine) {
    checkDatabase()
  }
}

// runs when error occurs
request.onerror = event => {
  console.log(event.target.errorCode)
}


const saveOffline = offlineItem => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')

  store.add(offlineItem)
}

const checkDatabase = () => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const getAll = store.getAll()

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      axios.post('/api/transaction/bulk', getAll.result)
        .then(() => {
          const transaction = db.transaction(['pending'], 'readwrite')
          const store = transaction.objectStore('pending')
          store.clear()
        })
    }
  }
}


window.addEventListener('online', checkDatabase)