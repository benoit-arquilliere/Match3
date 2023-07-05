document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 8;
    const gemColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

    const gameGrid = document.querySelector('.game-grid');
    let selectedGem = null;
    let score = 0;
    let nbCoups = 0;

    updateScore();

    function createGem() {
        const gem = document.createElement('div');
        gem.classList.add('gem');
        gem.style.backgroundColor = getRandomColor();
        gem.addEventListener('click', () => onGemClick(gem));
        return gem;
    }

    function getRandomColor() {
        return gemColors[Math.floor(Math.random() * gemColors.length)];
    }

    function generateGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gem = createGem();
                gameGrid.appendChild(gem);
            }
        }
    }

    function onGemClick(gem) {
        if (gem.style.backgroundColor != 'white') {
            if (selectedGem === gem) {
                // Désélectionne la gemme si elle est déjà sélectionnée
                gem.style.border = 'none';
                selectedGem = null;
            } else if (selectedGem === null) {
                // Sélectionne la gemme si aucune gemme n'est déjà sélectionnée
                gem.style.border = '2px solid yellow';
                selectedGem = gem;
            } else if (isAdjacentGem(gem, selectedGem)) {
                // Échange les deux gemmes si elles sont adjacentes
                const gem1Index = Array.from(gameGrid.children).indexOf(selectedGem);
                const gem2Index = Array.from(gameGrid.children).indexOf(gem);
                gameGrid.insertBefore(gem, gameGrid.children[gem1Index]);
                gameGrid.insertBefore(selectedGem, gameGrid.children[gem2Index]);
                selectedGem.style.border = 'none';
                selectedGem = null;
                score -= 10;
                nbCoups++;
                updateScore();
                checkMatches();
            } else {
                // Désélectionne la gemme si elle n'est pas adjacente à la gemme sélectionnée
                selectedGem.style.border = 'none';
                selectedGem = null;
            }
        }
    }

    function isAdjacentGem(gem1, gem2) {
        const gem1Index = Array.from(gameGrid.children).indexOf(gem1);
        const gem2Index = Array.from(gameGrid.children).indexOf(gem2);

        const gem1Row = Math.floor(gem1Index / gridSize);
        const gem1Col = gem1Index % gridSize;
        const gem2Row = Math.floor(gem2Index / gridSize);
        const gem2Col = gem2Index % gridSize;

        const isAdjacentRow = Math.abs(gem1Row - gem2Row) === 1 && gem1Col === gem2Col;
        const isAdjacentCol = Math.abs(gem1Col - gem2Col) === 1 && gem1Row === gem2Row;

        return isAdjacentRow || isAdjacentCol;
    }

    function updateScore() {
        document.querySelector('.score').innerHTML = "Score : " + score + "<br>Coups : " + nbCoups;
    }


    function checkMatches() {
        const gems = Array.from(gameGrid.children);
        const rows = Array.from({ length: gridSize }, (_, index) =>
            gems.slice(index * gridSize, index * gridSize + gridSize)
        );

        const columns = Array.from({ length: gridSize }, (_, index) =>
            gems.filter((_, i) => i % gridSize === index)
        );

        const rowsColors = rows.map(row => row.map(gem => gem.style.backgroundColor));
        const columnsColors = columns.map(column => column.map(gem => gem.style.backgroundColor));


        const matches = [];
        rowsColors.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
                if (color === rowsColors[rowIndex][colIndex + 1] && color === rowsColors[rowIndex][colIndex + 2]) {
                    matches.push([rowIndex, colIndex]);
                    matches.push([rowIndex, colIndex + 1]);
                    matches.push([rowIndex, colIndex + 2]);
                }
            });
        });

        console.log(matches);

        columnsColors.forEach((column, colIndex) => {
            column.forEach((color, rowIndex) => {
                if (color === columnsColors[colIndex][rowIndex + 1] && color === columnsColors[colIndex][rowIndex + 2]) {
                    matches.push([rowIndex, colIndex]);
                    matches.push([rowIndex + 1, colIndex]);
                    matches.push([rowIndex + 2, colIndex]);
                }
            });
        });

        console.log(matches);

        let emptyCellsCount = 0;


        matches.forEach(match => {
            const [rowIndex, colIndex] = match;
            const gemIndex = rowIndex * gridSize + colIndex;
            const gem = gameGrid.children[gemIndex];
            gem.style.backgroundColor = 'white';
            emptyCellsCount++;
            score += 10;
            updateScore();
        });

        i = 0;

        if (emptyCellsCount > 0) {
            while (i < gridSize) {
                console.log('emptyCellsCount', emptyCellsCount);
                for (let i = 0; i < gridSize; i++) {
                    for (let j = gridSize - 1; j >= 0; j--) {
                        const gem = rows[j][i];
                        if (gem.style.backgroundColor === 'white') {
                            const gemAbove = rows[j - 1] && rows[j - 1][i];
                            if (gemAbove) {
                                gem.style.backgroundColor = gemAbove.style.backgroundColor;
                                gemAbove.style.backgroundColor = 'white';
                                gem.classList.add('fall-animation');
                            } else {
                                gem.style.backgroundColor = getRandomColor();
                                gem.classList.add('fall-animation');
                            }
                        }
                    }
                }
                i++;
            }

            setTimeout(() => {
                gems.forEach(gem => {
                    gem.classList.remove('fall-animation');
                });
                checkMatches();
            }, 600);
        }

    }


    generateGrid();
});
