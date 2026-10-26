// this function handles the dark/light mode switch
export function initTheme() {
  // get the toggle checkbox
  const checkbox = document.getElementById('theme-toggle');

  // check if a theme was saved before and use it
  // checkbox is checked when its light mode
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    checkbox.checked = savedTheme === 'light';
  }

  localStorage.getItem('data-theme');

  // when the toggle is clicked change the theme
  // and save it to localStorage so it stays after refresh
  document
    .getElementById('theme-toggle')
    .addEventListener('change', function () {
      if (checkbox.checked) {
        // light mode
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        // dark mode
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  console.log('Theme initialized');
}
