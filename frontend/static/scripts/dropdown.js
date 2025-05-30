function setUpDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const dropdownButton = dropdown.querySelector(".dropdownButton");
    const content = dropdown.querySelector(".dropdownContent");
    const searchBox = dropdown.querySelector(".searchBox");
    const dropdownOptions = dropdown.querySelectorAll(".dropdownOption");
    const selectedOption = dropdown.querySelector(".selectedOption");

    // Toggle dropdown visibility
    dropdownButton.addEventListener("click", () => {
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
    
    //Dropdown translator.
    document.addEventListener("DOMContentLoaded", function () {
        dropdownOptions.forEach(option => {
            option.addEventListener("click", function () {
                selectedOption.value = this.getAttribute("data-value");
                dropdownButton.textContent = this.getAttribute("data-name");
                content.style.display = "none";
            
                //console.log(this.getAttribute("data-name"));
                //console.log(document.querySelector(".dropdownButton").textContent);
                //console.log(selectedOption.value);
            });
        });
    });
}