// from image list (top of page) to jigsaw boxes:
// - start / enter / over / drop / end
// - dragEnter Target: 'box first' then 'jigsaw'
// From one jigsaw box to another:
// - enter / over / drop

const boxes = document.querySelectorAll('.box');
let images = document.querySelectorAll('.image'); // needs to be called again when we add new divs to it (returning image)
const jigsaws = document.getElementById('jigsaw');
// let imageClasses = document.getElementsByClassName('image');
let imagesDiv = document.querySelector('.image-parts');
const hintButton = document.querySelector('.hintBtn');
const restartButton = document.querySelector('.restart');
let hints = document.querySelectorAll('.hint'); // need to refresh

const numbers = {
  one: 12,
  two: 2,
  three: 10,
  four: 5,
  five: 4,
  six: 7,
  seven: 6,
  eight: 9,
  nine: 8,
  ten: 3,
  eleven: 11,
  twelve: 1
};

let currentImg = 'one';
let currentJigBox = '';
let currentHold = 'image'; // or 'jigsaw'
let imagesInPile = images.length;
console.log(imagesInPile);
let dragEndCalled = 0; // so that if `imagesInPile` and `dragEndCalled` don't add up to 12 (total images), we refresh the image pile (before doing this: returning image to pile meant that image wouldn't get removed when dragged to jigsaw again)
let droppedIntoJigsawBoxes = false; // so that if user drags it but doesn't drop it into jigsaw, then we don't remove image from pile

for (const image of images) {
  image.addEventListener('dragstart', dragStart);
  image.addEventListener('dragend', dragEnd);
}

for (const box of boxes) {
  box.addEventListener('dragstart', dragStart);
  box.addEventListener('dragenter', dragEnter);
  box.addEventListener('dragover', dragOver);
  box.addEventListener('dragleave', dragLeave);
  box.addEventListener('drop', dragDrop);
  box.addEventListener('click', jigImgClick);
}

function refreshImagePile() {
  if (imagesInPile + dragEndCalled !== 12) {
    // i.e. image returned to pile
    // reset the images node list to incorporate re-additions to pile
    images = document.querySelectorAll('.image');
    for (const image of images) {
      image.addEventListener('dragstart', dragStart);
      image.addEventListener('dragend', dragEnd);
    }
    hints = document.querySelectorAll('.hint'); // so that the images added back to pile have its 'hint' child toggable
  }
}

function returnJigsawPieceToImagePile(imageNumber) {
  var element = document.createElement('div');
  element.classList.add('image', imageNumber); // should be the number of 'returned image'
  element.setAttribute('draggable', true);
  var subElement = document.createElement('div');
  subElement.classList.add('hint', 'hide');
  element.appendChild(subElement).appendChild(document.createTextNode(numbers[imageNumber]));
  imagesDiv.appendChild(element);
  imagesInPile++;
  console.log('imagesInPile:', imagesInPile);
  refreshImagePile();
}

function jigImgClick(e) {
  console.log('Jigsaw Image Click');
  if (e.target.classList[1]) {
    // if not undefined
    returnJigsawPieceToImagePile(e.target.classList[1]);
    if (e.target.className !== 'jigsaw') {
      this.children[0].className = 'jigsaw';
    }
    displayFinalImage();
  }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
borderWidth = 3;
scale(borderWidth, 3, 0, 3, 0);

function displayFinalImage() {
  if (imagesInPile === 0) {
    boxes.forEach((box) => {
      box.style.border = '0px solid #fff'; // or 'none'
      box.style.margin = '0px';
    });
  } else {
    boxes.forEach((box) => {
      box.style.border = '3px solid #fff';
      box.style.margin = '2px';
    });
  }
}

function dragStart(e) {
  // when you start clicking on the image and dragging it
  console.log('drag start');
  droppedIntoJigsawBoxes = false;
  currentHold = e.target.classList[0];
  imgNumber = e.target.classList[1];
  currentImg = imgNumber;
}

function dragEnd(e) {
  // when you let go to the image (regardless of where you unclick)
  console.log('drag end');
  if (droppedIntoJigsawBoxes) {
    this.remove(); // remove image class from JUST list of images at the top of page
    imagesInPile--;
    dragEndCalled++;
  }
  console.log('imagesInPile', imagesInPile);
  if (imagesInPile === 0) {
    displayFinalImage();
  }
}

function dragOver(e) {
  // hovering over the jigsaw box
  console.log('drag over');
  e.preventDefault();
  this.classList.add('hovered');
}

function dragEnter(e) {
  // enter a jigsaw box
  console.log('drag enter');
  e.preventDefault();
}

function dragLeave(e) {
  // when the image leaves its previous place (or a jigsaw box)
  console.log('drag leave');
  this.classList.remove('hovered');
  if (currentHold === 'jigsaw' && e.target.className === 'jigsaw') {
    this.children[0].className = 'jigsaw';
  }
  if (currentImg === e.target.classList[1]) {
    this.children[0].className = 'jigsaw';
  }
}

function dragDrop(e) {
  // when you drop the image in one of the jigsaw boxes
  console.log('drag drop');
  console.log('current image:', currentImg);
  console.log('image to move:', e.target.classList[1]);
  if (e.target.className !== 'jigsaw' && currentImg !== e.target.classList[1]) {
    // means that that jigsaw box HAS another image in it && the image isn't itself
    console.log('image to return:', e.target.classList[1]);
    returnJigsawPieceToImagePile(e.target.classList[1]);
  }
  currentJigBox = e.target.classList[1];
  this.classList.remove('hovered');
  this.children[0].className = 'jigsaw ' + currentImg; // instead of just `+= ' ' + currentImg`: so that it doesn't become "jigsaw seven nine two" etc
  droppedIntoJigsawBoxes = true;
}

hintButton.addEventListener('click', (e) => {
  console.log('Hint Button Clicked!');
  hints.forEach((hint) => {
    // `for (const hint of hints)` doesn't work not sure why
    hint.classList.toggle('hide');
  });
  const btnDiv = document.querySelector('.btn');
  if (btnDiv.classList.contains('hints-hidden')) {
    e.target.innerHTML = 'Hide Hint!';
    btnDiv.classList.remove('hints-hidden');
  } else {
    e.target.innerHTML = 'Show Hint!';
    btnDiv.classList.add('hints-hidden');
  }
});

restartButton.addEventListener('click', () => {
  window.location.reload();
});
