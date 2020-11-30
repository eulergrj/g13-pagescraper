UI.registerHelper('isSelected', function (option, value) {
    return (option === value) ? ' selected' : null;
});

UI.registerHelper('isActive', function (option, value) {
    return (option === value) ? ' active' : null;
});

UI.registerHelper('isChecked', function (option, value) {
	return (option === value) ? 'checked' : '';
});
