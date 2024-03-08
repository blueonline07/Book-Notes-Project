$(document).ready(function(){
    const searchInput = $("#searchInput");
    const dropdownList = $("#dropdownList");

    searchInput.keypress($.debounce(300,async ()=>{
        dropdownList.empty();
        searchTerm = searchInput.val().trim();
        const {bookTitle, bookAuthor, bookCover} = await fetchData(searchTerm);
        dropDownUpdate(bookTitle,bookAuthor,bookCover, dropdownList);
    }));    
    searchInput.click(()=>{dropdownList.show()})
    dropdownList.mouseleave(()=>{dropdownList.hide()})
    async function fetchData (searchTerm){
        try{
            const resp = await fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=10`);
            if (!resp.ok) {
                throw new Error(`HTTP error! Status: ${resp.status}`);
            }
            const data = await resp.json();
            console.log(data);
            const result = data.docs;
            const bookTitle = result.map((book)=> book.title);
            const bookAuthor = result.map((book)=> book.author_name[0] || "unknown");
            const bookCover = result.map((book)=> book.cover_i);
            return {
                bookTitle: bookTitle,
                bookAuthor: bookAuthor,
                bookCover: bookCover
            };
        }
        catch(err){
            console.error(err);
        }
    }
    async function dropDownUpdate(bookTitle, bookAuthor, bookCover, dropdownList){
        for (var i = 0; i < bookTitle.length; i++) {
          dropdownList.append(
          `<div class="listItem">
          <a href = "/book?title=${bookTitle[i]}&author=${bookAuthor[i]}&coverId=${bookCover[i]}">
          <li>
          <div class="book-cover">
          <img src = "https://covers.openlibrary.org/b/id/${bookCover[i]}-S.jpg">
          </div>
          <div class = "book-info">
          <p><strong>${bookTitle[i]}</strong></p>
          </div>
          </li>
          </a>
          </div>`
          );
        }
    }
});
    
