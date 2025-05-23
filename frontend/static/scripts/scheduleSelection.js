document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".schedule-cell");

    cells.forEach(cell => {
       cell.addEventListener("click", function () {
          let row = this.parentNode; // Linha atual
          let table = row.parentNode; // Corpo da tabela
          let rowIndex = [...table.children].indexOf(row); // Índice da linha
          let cellIndex = this.cellIndex; // Índice da célula na linha 
          let firstBlock = this;
          let secondBlock = table.children[rowIndex + 1]?.children[cellIndex];

          if (!secondBlock) return; // Se não houver próximo bloco, não faz nada   

          // Remover todas as seleções antes de adicionar uma nova
          document.querySelectorAll(".schedule-cell.selected")
            .forEach(el => el.classList.remove("selected"));

          // Aplicar a seleção nos blocos
          firstBlock.classList.add("selected");
          secondBlock.classList.add("selected");
       });
    });
});