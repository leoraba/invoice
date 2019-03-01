exports.invoicesGridController = function($scope, $http, Auth, $location) {
    var myDate = new Date();
    var currentMonth = myDate.getMonth();
    var currentYear = myDate.getFullYear();
  
    $scope.selectMonth = {
        value: currentMonth.toString(),
        choices: ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"]
    };
  
    $scope.selectYear = {
      value: currentYear.toString(),
      choices: [myDate.getFullYear()+1, myDate.getFullYear(), myDate.getFullYear()-1, myDate.getFullYear()-2]
    }
  
    $http.get('/api/categories')
    .then(function (response) {
      if(response.data.success == true){
        $scope.categories = response.data.categories;
      }else{
        Auth.logout();
        $location.path('/login');
      }
    });
  
    $scope.getMyCollection = function(year, month){
      $http.get('/api/collection/' + year + '/' + month)
      .then(function (response) {
        if(response.data.success == true){
          $scope.collectionInvoices = response.data.invoices;
          $scope.collectionReminders = response.data.reminders;
          $scope.totalPending = parseFloat(response.data.pending);
          $scope.totalPaid = parseFloat(response.data.paid);
          $scope.total = ($scope.totalPending + $scope.totalPaid).toFixed(2);
          $scope.categoryCounter = response.data.categoryCounter;
        }else{
          Auth.logout();
          $location.path('/login');
        }
      });
    }
  
    $scope.getMyCollection(currentYear, (parseInt(currentMonth) + 1));
  
    $scope.openInvoiceInit = function(categoryId, reminderId, amount){
      $scope.openInvoice = {};
      $scope.openInvoice.reminderId = reminderId;
      $scope.openInvoice.categoryId = categoryId;
      $scope.openInvoice.month = (parseInt($scope.selectMonth.value) + 1);
      $scope.openInvoice.year = $scope.selectYear.value;
      $scope.openInvoice.amount = amount;
    }
  
    $scope.cleanOpenInvoiceForm = function(){
      $scope.openInvoice = {};
    }
  
    $scope.saveInvoice = function(){
      $http.post('/api/invoice', $scope.openInvoice)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCollection($scope.selectYear.value, (parseInt($scope.selectMonth.value) + 1));
            }
          }else{
            Auth.logout();
            $location.path('/login');
          }
      });
    }
  
    $scope.searchInvoicesByDate = function(){
      $scope.getMyCollection($scope.selectYear.value, (parseInt($scope.selectMonth.value) + 1));
    }
};