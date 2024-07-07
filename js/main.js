document.addEventListener("DOMContentLoaded", function async() {

  fetch(
    "../data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("news-container");
      // Ensure the container has a 'row' class to use Bootstrap's grid system
      container.className = "row";
      container.innerHTML = ""; // Clear existing content
      data && data.forEach((article) => {
        if (
          article.title !== null &&
          article.description !== null &&
          article.url !== null &&
          article.urlToImage !== null
        ) {
          // Create a column for each card with responsive classes
          const col = document.createElement("div");
          col.className = "col-lg-2 col-md-4 col-12 mb-4"; // Adjust these classes based on your layout needs
          // Use Bootstrap card classes for styling
          col.innerHTML = `
                <div class="card custom-card bg-danger text-white">
                    <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title ">${article.title}</h5>
                        <p class="card-text">${article.description}</p>
                        <a href="${article.url}" style="background-color: white; color: black;" target="_blank" class="btn custom-btn">Read more</a>
                    </div>
                </div>
            `;
          container.appendChild(col); // Append the column (with the card) to the container
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      const container = document.getElementById("news-container");
      container.innerHTML = "<p>Failed to load news.</p>";
    });
});

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
    subscribeUserToPush();
  } else {
    console.log("Notification permission denied.");
  }
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUserToPush() {
  navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BE0G5qTqtd4iZ2W07M5oE2Hmx0piYms2ZqVNhmrMgoETk_RARa7wMKXjonRJK_OiLC-BzBS2E2w1cw0MZE9H4QI"
        ),
      })
      .then((subscription) => {
        console.log("User is subscribed:", subscription);

        // Send subscription to the server
        // fetch("https://pwa-mlbl.onrender.com/subscribe", {
        fetch("http://127.1.1.0/subscribe", {

          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            console.log("Subscription sent to server:", response);
          })
          .catch((error) => {
            console.error("Failed to send subscription to server:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to subscribe the user:", error);
      });
  });
}
