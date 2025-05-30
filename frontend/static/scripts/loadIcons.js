document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.icon-container').forEach(container => {
        const iconName = container.dataset.icon;
        //const basePath = "{% static 'images/icons/' %}";
        const iconPath = `${basePath}${iconName}.svg`;
        
        fetch(iconPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Icon not found: ${iconPath}`);
                }
                return response.text();
            })
            .then(svgText => {
                container.innerHTML = svgText;
            })
            .catch(error => {
                console.warn(error);
                container.innerHTML = `<span class="fallback-icon" title="Missing icon: ${iconName}">ERROR</span>`;
            });
    });
});