exports.NavBarController = function($scope, Auth) {
  if(Auth.isLoggedIn()){
    $scope.user = Auth.currentUser();
    setTimeout(function() {
      $scope.$emit('NavBarController');
    }, 0);
  }
};

exports.FooterController = function($scope) {

  setTimeout(function() {
    $scope.$emit('FooterController');
  }, 0);
};

exports.InvoicesGridController = function($scope, $http, Auth, $location) {
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

exports.SetupInvoicesController = function($scope, $http, $location, Auth) {
  var days = [];
  for( i = 1 ; i <= 31 ; i++ ){
    days.push(i);
  }
  $scope.days = days;
  $scope.newCategory = {};
  $scope.newReminder = {};
  $scope.categories = {};

  $scope.selectCategory = function(catId){
    $scope.reminders = {};
    $scope.newReminder.categoryId = catId;
    $http.get('/api/reminders/category/' + catId )
    .then(function (response) {
      if(response.data.success == true) {
        $scope.reminders = response.data.reminders;
      }else{
        Auth.logout();
        $location.path('/login');
      }
    });
  }

  $scope.getMyCategories = function(){
    $http.get('/api/categories')
    .then(function (response) {
      if(response.data.success == true){
        $scope.categories = {};
        $scope.categories.categories = response.data.categories;
      }else{
        Auth.logout();
        $location.path('/login');
      }
    });
  }

  $scope.getMyCategories();
  
  //delete category
  $scope.deleteCat = function(catId){
    $http.delete('/api/category/' + catId)
    .then(function (response) {
      if(response.data.success == true){
        $scope.getMyCategories();
      }else{
        Auth.logout();
        $location.path('/login');
      }
    });
  }

  //save new category
  $scope.saveNewCategory = function(){
    $http.post('/api/category', $scope.newCategory)
    .then(function (response) {
        if(response.data.success == true) {
          if(response.data.message){
            $scope.error = response.data.message;
            $scope.dataLoading = false;
          }else{
            $scope.getMyCategories();
          }
        } else {
          Auth.logout();
          $location.path('/login');
        }
    });
    $scope.newCategory = {};
  }

  $scope.cleanNewCategoryForm = function(){
    $scope.newCategory = {};
  }

  //save new reminder
  $scope.saveNewReminder = function(){
    $http.post('/api/reminder', $scope.newReminder)
    .then(function (response) {
        if(response.data.success == true) {
          if(response.data.message){
            $scope.error = response.data.message;
            $scope.dataLoading = false;
          }else{
            $scope.getMyCategories();
          }
        } else {
          Auth.logout();
          $location.path('/login');
        }
    });
    var categoryId = $scope.newReminder.categoryId;
    $scope.newReminder = {};
    $scope.newReminder.categoryId = categoryId;
  }

  $scope.removeReminder = function($reminderId){
    $http.delete('/api/reminder/' + $reminderId)
    .then(function (response) {
        if(response.data.success == true) {
          if(response.data.message){
            $scope.error = response.data.message;
            $scope.dataLoading = false;
          }else{
            $scope.getMyCategories();
          }
        } else {
          Auth.logout();
          $location.path('/login');
        }
    });
  }

  $scope.cleanNewReminderForm = function(){
    var categoryId = $scope.newReminder.categoryId;
    $scope.newReminder = {};
    $scope.newReminder.categoryId = categoryId;
  }
  
};

exports.LoginController = function($scope, Auth, $location){
  $scope.credentials = {};

  $scope.login = function(){
    if($scope.credentials.username == undefined || $scope.credentials.password == undefined){
      $scope.error = "User and/or password are incorrect";
      $scope.dataLoading = false;
    }else{
      Auth.login($scope.credentials, function(data) {
        if(data.success == true) {
            $location.path('/');
        } else {
            $scope.error = data.message;
            $scope.dataLoading = false;
        }
      });
    }
  }
};

exports.RegisterController = function($scope, $http, $location, Auth){
  $scope.user = {};

  $scope.register = function(){
    if($scope.user.name == undefined || $scope.user.email == undefined || $scope.user.password == undefined || $scope.user.password2 == undefined){
      $scope.error = "All fields are required";
      $scope.dataLoading = false;
    }else if($scope.user.password != $scope.user.password2){
      $scope.error = "Passwords don't match";
      $scope.dataLoading = false;
    }else{
      $http.post('/api/register', $scope.user)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $location.path('/login');
            }
          } else {
            Auth.logout();
            $location.path('/login');
          }
      });
    }
  };
}

exports.ConfigurationController = function($scope, $http, $location, Auth){
    $http.get('/api/me')
    .then(function (response) {
        if(response.data.success == true){
          $scope.user = response.data.user;
        }else{
          Auth.logout();
          $location.path('/login');
        }
    });

    $scope.saveConfiguration = function(){
      if($scope.user.name == undefined){
        $scope.error = "All fields are required";
        $scope.dataLoading = false;
      }else if($scope.user.password != $scope.user.password2 && ($scope.user.password != undefined && $scope.user.password.length > 0)){
        $scope.error = "Passwords don't match";
        $scope.dataLoading = false;
      }else{
        $http.post('/api/me', { name: $scope.user.name, password: $scope.user.password})
        .then(function (response) {
          if(response.data.success == true){
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $http.get('/api/me')
              .then(function (response) {
                  if(response.data.success == true){
                    Auth.updateUser(response.data.user);
                    $location.path('/');
                  }else{
                    Auth.logout();
                    $location.path('/login');
                  }
              });
            }
          }
        });
      }
    }

}

exports.LogoutController = function($scope, Auth, $location){
  Auth.logout();
  $location.path('/login');
}