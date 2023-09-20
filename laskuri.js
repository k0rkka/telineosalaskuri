
//---------------------Osalistat----------------------//

const parts = [[]]; // Valmis osalista
var standards = [3, 2.5, 2, 1.5, 1, 0.5]; // Pystysalkojen osalista
 var ledgers = [0.732, 1.088, 1.4, 2.072, 2.572, 3.072] // Jokkien osalista

//--------------------- Alasvetovalikot, tekstikenttä ja painikkeet------------------------//


// Lohkojako alasvetovalikko
const blockButton = document.getElementById('blockButton');
const blockDropdownItems = document.querySelectorAll('.dropdown-item.multiplier');

blockDropdownItems.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedValue = item.getAttribute('data-value');
    blockButton.textContent = selectedValue;
    fillLengthField(selectedValue);
  });
});

// Telineen pituus alasvetovalikko.
const lengthButton = document.getElementById('lengthButton');
const lengthDropdown = document.getElementById('lengthDropdown');

lengthDropdown.addEventListener('click', (event) => {
  if (event.target.classList.contains('dropdown-item') && event.target.classList.contains('length')) {
    const selectedValue = event.target.getAttribute('data-value');
    lengthButton.textContent = selectedValue;
  }
});

// Telineen syvyys alasvetovalikko.
const depthButton = document.getElementById('depthButton');
const depthDropdown = document.querySelectorAll('.dropdown-item.depth');

depthDropdown.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedDepth = item.getAttribute('data-value');
    depthButton.textContent = selectedDepth;
  });
});

// Telineen korkeus syötekenttä

const inputHeight = document.getElementById("height");

// Laske ja nollaa panikkeet

const calculateButton = document.getElementById("calculateButton");
const resetButton = document.getElementById("resetButton");


//----------------------Funktiot eri laskentoihin----------------------------//


// Telineen pituus alasvetovalikon laskenta lohkojaon mukaan. Parametrinä valittu lohkojaon valittu arvo
    function fillLengthField(selectedValue) {
      var calculatedLenghts = [];
      var allValues = 1;

      for (var i = 0; i <= 50; i++) {
        if (i != 0) {
          calculatedLenghts[i] = (i * selectedValue).toFixed(3);
        }
      }

      var lengthDropdown = document.getElementById('lengthDropdown');
      lengthDropdown.innerHTML = '';

      calculatedLenghts.forEach((value) => {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.classList.add('dropdown-item', 'length')
        a.textContent = "Kerroin " + allValues + " => " + value;
        allValues++
        a.setAttribute('data-value', value);
        li.appendChild(a);
        lengthDropdown.appendChild(li);
      });
    }

// Telineen syvyys alasvetovalikon laskenta
  
  function fillDepthField(selectedDepth) {
    var calculatedDepths = [];

          for (var i = 0; i <= 50; i++) {
        calculatedDepths[i] = (i * selectedDepth).toFixed(3);
      }
  }

// Tulokset
const results = document.getElementById('result')


// Funktio pyöristää telineen korkeuden lähimpään kokonaislukuun tai puolikkaaseen

  function round(number) {
    var integerPart = Math.floor(number);
    var decimalPart = number - integerPart;

    if (decimalPart < 0.25) {
      return integerPart;
    }
    else if (decimalPart < 0.75) {
      return integerPart + 0.5;
    } else {
      return integerPart + 1;
    }
  }

// Telineen aloituspalojen, säätöjalkojen ja aluslevyjen laskenta

function calculateStarters(blocks) {
  let adjustableBase = (blocks + 1) * 2;
  let baseCollar = adjustableBase;
  let basePlates = adjustableBase;

  parts.push(["Aluslevyt", basePlates]);
  parts.push(["Säätöjalat", adjustableBase]);
  parts.push(["Aloituspalat", baseCollar]);

  return baseCollar;
}

// Telineen pystysalkojen lasku
function calculateStandards(roundedHeight, baseCollar) {
  let remainder = roundedHeight; // Alustetaan jakojäännös alkuperäisellä korkeudella

  for (let i = 0; i < standards.length; i++) {
    let standard = standards[i];
    let standardCount = Math.round(remainder / standard); // Kuinka monta koko osaa mahtuu
    if (standardCount > 0) {
      parts.push(["Pystysalko " + standard, standardCount * baseCollar]);
      remainder = remainder % standard; // Päivitetään jakojäännös
    }
  }
}

// Jokkien laskukaava
function calculateLedgers(roundedHeight, blocks, depth) {
  ledgersCount = (roundedHeight / 2 + 1) * (blocks +1)
  for (i = 0; i < ledgers.length; i++) {
    if (ledgers[i] == depth) {
      parts.push(["U-Jokka " + depth, ledgersCount])
    }
  }
}
// Runko telineosien laskulle

  function calculate() {
    
    let block = parseFloat(document.getElementById("blockButton").textContent);
    var length =  parseFloat(document.getElementById("lengthButton").textContent);
    var depth = parseFloat(document.getElementById("depthButton").textContent);
    let inputHeight = document.getElementById('height').value;
    let height = parseFloat(inputHeight);
    let roundedHeight = round(height);
    var blocks = length / block;

    if (block && length && depth && height) {
      let baseCollar = calculateStarters(blocks)
      calculateStandards(roundedHeight, baseCollar);
      calculateLedgers(roundedHeight, blocks, depth);
    } else {
      showModal("#error");
      reset();
    }

// Tee seuraavaksi funktio juoksujen laskuja varten

    /* console.log("Lohkojako" + block);
    console.log("Pituus: " + length);
    console.log("Syvyys: " + depth);
    console.log("Korkeus: " + height);
    console.log("Lohkojen määrä: " + blocks)
    */

    printParts();
  }

  //-----------Lomakkeen toiminnallisuuksia-----------//


  function reset() {
    blockButton.textContent = "Jako";
    lengthButton.textContent = "Pituus";
    depthButton.textContent = "Syvyys";
    inputHeight.value = "";
    parts.length = 0;
    results.innerHTML = "";
  }

  function showModal(modalName) {
  $(modalName).modal('show');
}

function hideModal(modalName) {
  $(modalName).modal('hide');
}


function printParts() {
  var partsText = "Osalista:<br>";

  for (i = 1; i < parts.length; i++){
    partsText += parts[i][0] + ": " + parts[i][1] + " kpl<br>";
  }

  results.innerHTML = partsText;
}

