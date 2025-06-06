const upIconUrl = `${basePath}upArrow.svg`;
const downIconUrl = `${basePath}downArrow.svg`;

document.querySelectorAll('.icon-container').forEach(button => {
    button.addEventListener('click', function () {
        const currentCardBody = this.closest('.clientCard').querySelector('.cardBody');

        document.querySelectorAll('.clientCard .cardBody.active').forEach(card => {
            if (card !== currentCardBody) {
                card.classList.remove('active');
                const buttonToUpdate = card.closest('.clientCard').querySelector('.icon-container');
                fetch(downIconUrl)
                    .then(response => response.text())
                    .then(svg => {
                        this.innerHTML = svg;
                    });
            }
        });

        currentCardBody.classList.toggle('active');
        if (currentCardBody.classList.contains('active')) {
                fetch(upIconUrl)
                    .then(response => response.text())
                    .then(svg => {
                        this.innerHTML = svg;
                    });
        } else {
            fetch(downIconUrl)
                    .then(response => response.text())
                    .then(svg => {
                        this.innerHTML = svg;
                    });
        }
    });
});