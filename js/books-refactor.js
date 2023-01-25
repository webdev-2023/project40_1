/* Requiurements:
Create a webpage that can be used to let a user store information about a catalogue of books.
Make use of session storage to store the values.
    o The user should be able to add information (e.g. author, title, genre, reviews, etc.) about their favourite books.
    o All the information about all the books added by the user should be listed on the webpage.
    o The user should also be able to remove or edit information for a book.
*/

// create a blueprint of a book
class Book {
    constructor(title, author, genre, review) {
        this.title = title
        this.author = author
        this.genre = genre
        this.review = review
    }
}

// this function will be called when 'Add' button is clicked. 
const addBook = () => {
    // Get the array of book objects from sessionStorage and assign it to the array 'bookList'. 
    // We will append new book object to this bookList, and subsequently to sessionStorage.
    let bookList = JSON.parse(sessionStorage.getItem("books"))
    if ((document.getElementById('title').value != "") && (document.getElementById('subBtn').innerHTML == 'Add')) {
        let book = new Book(
            document.getElementById('title').value,
            document.getElementById('author').value,
            document.getElementById('genre').value,
            document.getElementById('review').value
        )
        bookList.push(book)
        sessionStorage.setItem("books", JSON.stringify(bookList))
    }
}

// this function will add book information as a row in the table
const addBookToTable = (book) => {
    const bookArr = document.querySelector('#bookRows')                     // all the 'tr' elements in table body
    // create a new row for a new book
    let row = document.createElement('tr')
    // add title, author, genre and review as td
    for (let key in book) {
        let data = document.createElement('td')
        data.innerHTML = book[key]
        row.appendChild(data)
    }
    // add Edit button as a child element of a td
    let dataEditBtn = document.createElement('td')
    let btnEdit = document.createElement('button')
    btnEdit.innerHTML = 'Edit'
    btnEdit.setAttribute("onclick", "editBook(this)")               // This is much cleaner approach than what I previously implemented in editBook()
    dataEditBtn.appendChild(btnEdit)
    row.appendChild(dataEditBtn)

    // add Delete button as a child element of a td
    let dataDeleteBtn = document.createElement('td')
    let btnDelete = document.createElement('button')
    btnDelete.innerHTML = 'Delete'
    btnDelete.onclick = function () {                               // another way of defining onClick()
        deleteBook(btnDelete)
    }
    dataDeleteBtn.appendChild(btnDelete)
    row.appendChild(dataDeleteBtn)

    bookArr.appendChild(row)
}

// this is a page load function. It initialises the bookList in the sessionStorage, 
// and calls the function to display each book available in sessionStorage as a row in the table.
// it also calls the editBook() and deleteBook() functions to activate onclick event listeners for Edit and Delete buttons.
const displayBooksTable = () => {
    let bookList = []
    let booksTable = document.getElementById("booksTable")
    booksTable.style.visibility = "hidden"

    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("books", JSON.stringify(bookList))
        sessionStorage.setItem("hasCodeRunBefore", true)
    } else {
        bookList = JSON.parse(sessionStorage.getItem("books"))      //Get the array of books objects from sessionStorage and assign it to the array 'bookList'
        for (let book of bookList) {
            addBookToTable(book)
        }
        if (bookList.length > 0) {                                  //Only make the book table visible once there is at least one book added.
            booksTable.style.visibility = "visible"
        }
    }
    // WE DON'T NEED TO CALL THESE FUNCTIONS ON PAGE LOAD
    // editBook()
    // deleteBook()
}

// this function will allow the user to edit the previously added information about a book. 
// it updates the selected record.
const editBook = (btnEdit) => {
    let bookList = JSON.parse(sessionStorage.getItem("books"))                      // list of all the books present in the sessionStorage

    //  THE CODE IS MUCH SIMPLER NOW WITH THE USE OF btnEdit.setAttribute("onclick", "editBook(this)") WHILE CREATING EDIT BUTTON

    idx = btnEdit.parentElement.parentElement.rowIndex - 1
    let rec = bookList[idx]                                             // arry representing current row

    // populate the input fields with existing information
    document.getElementById('title').value = rec.title
    document.getElementById('author').value = rec.author
    document.getElementById('genre').value = rec.genre
    document.getElementById('review').value = rec.review

    updateBtn = document.getElementById('subBtn')
    updateBtn.innerHTML = 'Update'                                      // change the text of Submit button from 'Add' to 'Update'

    // if Update button is clicked, update the whole record with new information
    updateBtn.addEventListener("click", () => {
        rec.title = document.getElementById('title').value
        rec.author = document.getElementById('author').value
        rec.genre = document.getElementById('genre').value
        rec.review = document.getElementById('review').value            // replace the record with the new information in the bookList
        bookList[idx] = rec
        sessionStorage.setItem("books", JSON.stringify(bookList))       // update the sessionStorage with the updated bookList
    })
}

// this function will allow the user to delete a book. 
const deleteBook = (btnDelete) => {
    let bookList = JSON.parse(sessionStorage.getItem("books"))                      // list of all the books present in the sessionStorage
    idx = btnDelete.parentElement.parentElement.rowIndex - 1
    bookList.splice(idx, 1)                                             // remove this record from bookList
    sessionStorage.setItem("books", JSON.stringify(bookList))           // update the sessionStorage with the updated bookList
    btnDelete.parentElement.parentElement.remove()                                           // remove the entire row from the table

    if (bookList.length == 0) {                                         //If no book left in bookList, hide the table
        document.getElementById("booksTable").style.visibility = "hidden"
    }

}


