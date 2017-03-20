exports.navBar = function() {
  return {
    controller: 'NavBarController',
    templateUrl: '../templates/nav_bar.html'
  };
};

exports.footerBar = function() {
  return {
    controller: 'FooterController',
    templateUrl: '../templates/footer_bar.html'
  };
};

exports.invoicesGrid = function() {
  return {
    controller: 'InvoicesGridController',
    templateUrl: '../templates/invoices_grid.html'
  };
};

exports.setupInvoices = function() {
  return {
    controller: 'SetupInvoicesController',
    templateUrl: '../templates/setup_invoices.html'
  };
};