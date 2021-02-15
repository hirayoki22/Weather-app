'use strict';

// Handle weather request failure
const weatherInfoError = err => {
  let srchContainer = document.querySelector('.search-form-wrap');
  let errorMsg = srchContainer.querySelector('.error-message__text');

  setSpinnerStatus(false);
  srchContainer.style.height = '155px';
  errorMsg.textContent = err;
  console.log('ERROR', err);
}

// Update the weather info on the page
const updateWeatherInfo = ({
  location,
  temperature,
  unit,
  description,
  bgImage, 
  icon
}) => {
  let weatherBox = document.querySelector('.weather-info');
  let wBgImage = document.querySelector('.header__bg-image');
  let wLocation = document.querySelector('.weather-info__location');
  let wDescription = document.querySelector('.weather-info__desc');
  let wTemperature = document.querySelector('.weather-info__temperature');
  let wIcon = document.querySelector('.weather-info__image');

  wBgImage.src = bgImage;
  wLocation.innerHTML = location;
  wDescription.textContent = description.join(', ');
  wTemperature.innerHTML = `${temperature}&deg; ${unit}`;
  wIcon.src = icon;

  closeSearchForm();

  // Show Weather box
  weatherBox.removeAttribute('data-updating');

  // Show Weather Background Image
  let interval = setInterval(() => {
    if (wBgImage.naturalWidth > 0 && wBgImage.naturalHeight > 0) {
      wBgImage.removeAttribute('data-updating');
      clearInterval(interval);
    }
  }, 10);

  console.log('Last weather update:', new Date().toLocaleString());
}

/*
 * Fetch weather info based of query
 * Can use an address in the form of 'City, Region, Country'
 * Or Provide the latitude and longitude as 144899,-6.4889 
 * Optionally, a unit can be provided, m or f for the temperature 
*/
const getWeather = (query, unit = 'm') => {
  let weatherBox = document.querySelector('.weather-info');
  let wBgImage = document.querySelector('.header__bg-image');

  // Un force that has to change...
  weatherBox.setAttribute('data-updating', '');

  fetch(`http://127.0.0.1:4000/weather?address=${encodeURI(query)}&unit=${unit}`)
    .then(res => res.json())
    .then(res => {
      res.error 
        ? weatherInfoError(res.error)
        : updateWeatherInfo(res);
    })
    .catch(e => console.log('ERROR: ', e.message))
    // .finally(closeSearchForm);
}

// Show the Search Form
const showSearchForm = () => {
  let overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
  <div class="search-form-wrap">
    <form class="search-form" id="search-form">
      <div class="search-form__group">
        <input type="text" class="search-form__input" 
          name="search-term" placeholder="Location or Latitude,Longitude">
        <button class="search-form__submit-btn" type="submit" disabled>
          <i class="material-icons">search</i>
        </button>
        <span class="search-form__spinner"></span>
      </div>
    </form>
    <div class="error-message">
      <p class="error-message__text">Unable to find any location</p>
    </div>
  </div>`;
  document.body.append(overlay);
  document.body.setAttribute('modal-active', '');

  let searchForm = overlay.querySelector('#search-form');

  // Auto focus search input
  setTimeout(() => overlay.querySelector('.search-form__input').focus(), 50);

  // Click outside event listener
  overlay.onclick = e => {
    if (e.target !== e.currentTarget) return;

    closeSearchForm();
  }

  // Escape key event listener
  document.onkeyup = e => {
    if (e.key !== 'Escape') return;

    document.onkeyup = null;
    closeSearchForm();
  }

  // Search Form Change event Listener 
  searchForm.addEventListener('input', setSrchBtnDisableState);

  // Search Form Submit event listener
  searchForm.addEventListener('submit', onSearch);
}

// Close Search Form
const closeSearchForm = () => {
  let overlay = document.querySelector('.overlay');

  if (!overlay) return;

  overlay.setAttribute('hide', '');
  overlay.onanimationend = () => {
    overlay.remove();
    document.body.removeAttribute('modal-active');
  };
}

const setSrchBtnDisableState = e => {
  let searchForm = e.target.closest('form');
  let submitBtn = searchForm.querySelector('.search-form__submit-btn');

  submitBtn.disabled = !e.target.value;
}

const setSpinnerStatus = (show = true) => {
  let submitBtn = document.querySelector('.search-form__submit-btn');
  let spinner = document.querySelector('.search-form__spinner');

  if (!show) {
    submitBtn.removeAttribute('hidden');
    spinner.removeAttribute('data-loading');
  } else {
    submitBtn.setAttribute('hidden', '');
    spinner.setAttribute('data-loading', '');
  }
}

// Search Form submit event handler
const onSearch = e => {
  e.preventDefault();

  let term = e.target['search-term'].value?.trim();
  
  if (!term) return;
  
  setSpinnerStatus();
  getWeather(term);
}

// Display Search Form on click
document.querySelector('#search-btn')
  .addEventListener('click', showSearchForm);

// Load predefined data because yes
getWeather('santo domingo');
