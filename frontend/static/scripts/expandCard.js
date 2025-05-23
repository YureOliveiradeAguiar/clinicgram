document.querySelectorAll('.expandButton').forEach(button => {
    button.addEventListener('click', function () {

        const currentCardBody = this.closest('.clientCard').querySelector('.cardBody');
        
        document.querySelectorAll('.clientCard .cardBody.active').forEach(card => {
            if (card !== currentCardBody) {
                card.classList.remove('active');
                const buttonToUpdate = card.closest('.clientCard').querySelector('.expandButton');
                buttonToUpdate.style.backgroundImage = "url('{% static 'images/down_arrow_icon.png' %}')";
            }
        });

        currentCardBody.classList.toggle('active');

        if (currentCardBody.classList.contains('active')) {
            this.style.backgroundImage = `url('${upArrowImageUrl}')`;
        } else {
            this.style.backgroundImage = `url('${downArrowImageUrl}')`;
        }
    });
});