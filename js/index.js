document.addEventListener("DOMContentLoaded", function() {
    let fetchUrl = "http://localhost:3000/books";
    let list = document.getElementById('list');
    let showPanel = document.getElementById('show-panel');
  
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
  
        data.forEach((item) => {
          let li = document.createElement('li');
          li.textContent = item.title;
  
          list.appendChild(li);
  
          li.addEventListener('click', () => handleClick(item)); // Pass item to handleClick
  
          function handleClick(book) {
            showPanel.innerHTML = ''; // Clear the showPanel
  
            const img = book.img_url;
            const description = book.description;
  
            const showPanelImage = document.createElement('img');
            showPanelImage.src = img;
            const showPanelDescription = document.createElement('p');
            showPanelDescription.textContent = description;
  
            const showPanelBtn = document.createElement('button');
            showPanelBtn.textContent = 'like';
  
            // Create a list to display users who liked the book
            const likedByList = document.createElement('ul');
  
            // Determine if the current user has liked the book
            const currentUser = { "id": 1, "username": "pouros" };
            const hasLiked = book.users.some(user => user.id === currentUser.id);
  
            if (hasLiked) {
              showPanelBtn.textContent = 'unlike';
            }
  
            showPanelBtn.addEventListener('click', () => handleLike(book, likedByList, showPanelBtn)); //  I struggle with this --- Pass book, likedByList, and showPanelBtn to handleLike
  
            showPanel.appendChild(showPanelImage);
            showPanel.appendChild(showPanelDescription);
            showPanel.appendChild(showPanelBtn);
            showPanel.appendChild(likedByList);
  
            // Display the list of users who liked the book
            updateLikedByList(likedByList, book.users);
          }
  
          function handleLike(book, likedByList, showPanelBtn) {
            // Check if the user has already liked the book
            const currentUser = { "id": 1, "username": "pouros" };
            const hasLiked = book.users.some(user => user.id === currentUser.id);
  
            if (hasLiked) {
              // Remove the current user from the list of users who liked the book
              book.users = book.users.filter(user => user.id !== currentUser.id);
              showPanelBtn.textContent = 'like'; // Change the button text to 'like'
            } else {
              // Add the current user to the list of users who like the book
              book.users.push(currentUser);
              showPanelBtn.textContent = 'unlike'; // Change the button text to 'unlike'
            }
  
            // Perform the PATCH request to update likes
            const patchUrl = `http://localhost:3000/books/${book.id}`;
  
            fetch(patchUrl, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: JSON.stringify({ "users": book.users }) // Send the updated users array
            })
              .then(res => res.json())
              .then(updatedBook => {
                // Update the UI by displaying the list of users who liked the book
                updateLikedByList(likedByList, updatedBook.users);
              })
              .catch(error => {
                console.error("Error updating like:", error);
              });
          }
  
          // Function to update the list of users who liked the book
          function updateLikedByList(likedByList, users) {
            likedByList.innerHTML = ''; // Clear the list
  
            users.forEach(user => {
              const listItem = document.createElement('li');
              listItem.textContent = user.username;
              likedByList.appendChild(listItem);
            });
          }
        });
      });
  });
  