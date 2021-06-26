if (window.matchMedia) {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		switchTheme('dark')
	} else {
		switchTheme('light')
	}

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		switchTheme(e.matches ? 'dark' : 'light')
	});
}

function switchTheme(theme) {
	const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
	const switchToTheme = theme || (currentTheme === 'light' ? 'dark' : 'light')
	document.documentElement.setAttribute('data-theme', switchToTheme);

	document.getElementById('themeSwitcher').innerText = `Switch to ${switchToTheme === 'light' ? 'dark' : 'light'} mode`
}