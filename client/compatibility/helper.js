if (typeof UI !== 'undefined') {
    UI.registerHelper('$eq', function (a, b) {
      return (a === b); //Only text, numbers, boolean - not array & objects
    });

    UI.registerHelper('$active',function (a,b) {      
      return (a === b)?'active':'';
    });
      
    UI.registerHelper('$', function() {
      return Helpers.superScope;
    });
}