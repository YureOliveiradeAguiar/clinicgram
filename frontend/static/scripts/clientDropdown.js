const dropdown = document.querySelector(".dropdown");
const button = document.querySelector(".dropdownButton");
const content = document.querySelector(".dropdownContent");
const searchBox = document.querySelector(".searchBox");
  
// Toggle dropdown visibility
button.addEventListener("click", () => {
  content.style.display = content.style.display === "block" ? "none" : "block";
  searchBox.value = "";
  filterClients("");
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    content.style.display = "none";
  }
});

// Filter clients based on search
searchBox.addEventListener("keyup", (e) => {
  filterClients(e.target.value.toLowerCase());
});

function filterClients(search) {
  document.querySelectorAll(".dropdownContent div").forEach((item) => {
    if (item.innerText.toLowerCase().includes(search)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}