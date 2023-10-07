document.addEventListener("DOMContentLoaded", function () {
    // DOM elements for the grid generation, please stop yelling at me about the DOM not loading I'm going to cry
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const generateGridButton = document.getElementById("generateGrid");
    const gridContainer = document.querySelector(".grid");

    // DOM elements for the fourth setting
    const amountInput = document.getElementById("amount");
    const subSettingsContainer = document.querySelector(".sub-settings");

    // Calculate button for performing calculations
    const calculateButton = document.getElementById("calculateButton");
    calculateButton.addEventListener("click", calculateValues);

    // Store subsetting values and initial colors
    let subSettingValues = [];
    const initialColors = [];

    // Event listeners for grid generation
    generateGridButton.addEventListener("click", generateGrid);

    // Event listener for amount input to generate subsettings and update initial colors
    amountInput.addEventListener("input", () => {
        generateSubSettings();
        storeInitialColors();
    });

	// Generate the grid with alternating numbering direction
	function generateGrid() {
		const width = parseInt(widthInput.value);
		const height = parseInt(heightInput.value);

		gridContainer.innerHTML = "";

		let reverse = false; // Variable to track whether to reverse numbering

		for (let row = 1; row <= height; row++) {
			for (let col = 1; col <= width; col++) {
				const div = document.createElement("div");

				// Calculate the div number based on alternating numbering direction
				let divNumber;
				if (reverse) {
					divNumber = (row - 1) * width + (width + 1 - col);
				} else {
					divNumber = (row - 1) * width + col;
				}

				div.textContent = divNumber;
				div.id = `G${divNumber}`;
				gridContainer.appendChild(div);
			}

			// Reverse the numbering direction for the next row
			reverse = !reverse;
		}

		gridContainer.style.gridTemplateColumns = `repeat(${width}, 30px)`;
		gridContainer.style.gridTemplateRows = `repeat(${height}, 30px)`;
	}

    // generate the subsettings
    function generateSubSettings() {
        const amount = parseInt(amountInput.value);

        subSettingsContainer.innerHTML = "";

        for (let i = 1; i <= amount; i++) {
            const subSettingLabel = document.createElement("label");
            subSettingLabel.textContent = `${i}:`;

            const colorPickerInput = document.createElement("input");
            colorPickerInput.type = "color";
            colorPickerInput.id = `colorPicker${i}`;
            colorPickerInput.value = "#000000"; // Default colour is black
            colorPickerInput.addEventListener("input", updateBackgroundColor);

            const subSettingInput = document.createElement("input");
            subSettingInput.type = "number";
            subSettingInput.step = "0.01";
            subSettingInput.placeholder = "Enter decimal number";
            subSettingInput.id = `subSetting${i}`;
            subSettingInput.addEventListener("input", updateBackgroundColor);

            const subSettingDiv = document.createElement("div");
            subSettingDiv.appendChild(subSettingLabel);
            subSettingDiv.appendChild(colorPickerInput);
            subSettingDiv.appendChild(subSettingInput);

            subSettingsContainer.appendChild(subSettingDiv);
        }
    }

    // Update the background colour of subsetting inputs based on color picker
    function updateBackgroundColor(event) {
        const inputId = event.target.id;
        const inputColor = event.target.value;
        const subSettingInput = document.getElementById(inputId.replace("colorPicker", "subSetting"));

        subSettingInput.style.backgroundColor = inputColor;
    }

    // Calculate values and apply colours to the grid divs
	function calculateValues() {
		// Clear previous calculations
		subSettingValues = [];

		// Get the selected option from the first setting
		const selectedOption = document.querySelector('input[name="firstSetting"]:checked').value;

		let divisor;

		if (selectedOption === "custom") {
			// Get the custom value from the input field
			const customValue = parseFloat(document.getElementById("customValue").value);
			divisor = isNaN(customValue) ? 1 : customValue; // Use 1 if the input is not a valid number
		} else {
			divisor = selectedOption === "1" ? 1 : 2;
		}

		// Calculate and round the values for each subsetting
		const subSettingInputs = document.querySelectorAll('.sub-settings input[type="number"]');
		subSettingInputs.forEach(input => {
			const value = parseFloat(input.value) / divisor;
			const roundedValue = Math.round(value);
			subSettingValues.push(roundedValue);
		});

        // Calculate the total number of grid divs
        const totalDivs = widthInput.value * heightInput.value;

        // Store the colors based on the pattern in array
        const patternColors = [];
        subSettingValues.forEach((value, index) => {
            const colorPickerInput = document.getElementById(`colorPicker${index + 1}`);
            const selectedColor = colorPickerInput.value;
            for (let i = 0; i < value; i++) {
                patternColors.push(selectedColor);
            }
        });

        // Apply the colours to the grid divs based on the number in their ID
		const gridDivs = gridContainer.querySelectorAll("div[id^='G']");
		gridDivs.forEach(div => {
			const divNumber = parseInt(div.id.slice(1)); // Extract the number from the ID
			const colorIndex = (divNumber - 1) % patternColors.length; // Calculate the colour index
			div.style.backgroundColor = patternColors[colorIndex];
		});

        // Display the resulting numbers and colour boxes in the results container
        const resultContainer = document.createElement("div");
        resultContainer.classList.add("result-container");

        subSettingValues.forEach((value, index) => {
            const resultDiv = document.createElement("div");

            // Get the selected color from the colour picker
            const colorPickerInput = document.getElementById(`colorPicker${index + 1}`);
            const selectedColor = colorPickerInput.value;

            // Create a colour box element
            const colorBox = document.createElement("div");
            colorBox.classList.add("color-box");
            colorBox.style.backgroundColor = selectedColor;
            resultDiv.appendChild(colorBox);

            // Create a text element for the number
            const numberText = document.createElement("div");
            numberText.textContent = value;
            resultDiv.appendChild(numberText);

            resultContainer.appendChild(resultDiv);
        });

        // Remove the previous result container if it exists
        const existingResultContainer = document.querySelector(".result-container");
        if (existingResultContainer) {
            existingResultContainer.remove();
        }

        // Append the new result container to the right side
        const rightSide = document.querySelector(".right-side");
        rightSide.appendChild(resultContainer);
    }

    // Get the corresponding initial color based on index
    function getInitialColor(index) {
        // Replace this this later
        const colorInput = document.getElementById(`subSetting${index}`);
        return colorInput ? colorInput.value : "#000"; // Default to black if no colour is selected
    }

    // Store the initial colours in the array
    function storeInitialColors() {
        initialColors.length = 0; // Clear previous colours

        for (let i = 1; i <= amountInput.value; i++) {
            initialColors.push(getInitialColor(i));
        }
    }

    // Initial grid generation and sub-setting generation
    generateGrid();
    generateSubSettings();
});
