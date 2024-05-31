document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing after the animation triggers
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the element is visible
  });

  cards.forEach(card => {
    observer.observe(card);
  });
});
const texts = ["Need a tutor?We got one for you","Personal Tuition Made Affordable !!" , "Need tuition?We are here for you"];
    let currentIndex = 0;

    // Function to change text after 2 seconds
    function changeText() {
        document.getElementById('changingText').innerText = texts[currentIndex];
        currentIndex = (currentIndex + 1) % texts.length; // Loop through texts
    }

    // Initial call to start changing text
    changeText();

    // Call the changeText function every 2 seconds
    setInterval(changeText, 2000);


// script.js
document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.getElementById('menu-icon');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-btn');

  menuIcon.addEventListener('click', function() {
      sidebar.style.left = '0';
  });

  closeBtn.addEventListener('click', function() {
      sidebar.style.left = '-250px';
  });

  // Close sidebar when clicking outside of it
  window.addEventListener('click', function(event) {
      if (event.target !== sidebar && event.target !== menuIcon && !sidebar.contains(event.target)) {
          sidebar.style.left = '-250px';
      }
  });
});
