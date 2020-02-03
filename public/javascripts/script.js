console.log('je suis dans script.js');
$('#confirm-btn').click(function() {
  var text = $('.content-basket').length + ' voyages';
  alert('Commande acceptée: ' + text);
});
