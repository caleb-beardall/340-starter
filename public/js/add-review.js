  const stars = document.querySelectorAll('#starRating span');
  const input = document.getElementById('review_stars');
  let selectedRating = parseInt(input.value) || 0;

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value) <= val));
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      input.value = selectedRating;
      stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating));
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (selectedRating > 0) {
      stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating));
    }
  });