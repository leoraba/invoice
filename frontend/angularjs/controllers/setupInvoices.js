exports.setupInvoicesController = function($scope, $http, $location, Auth) {
    var days = [];
    for( i = 1 ; i <= 31 ; i++ ){
      days.push(i);
    }
    $scope.days = days;
    $scope.newCategory = {};
    $scope.newReminder = {};
    $scope.categories = {};
    $scope.editReminder = {};
  
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
      choices: [myDate.getFullYear()+1, myDate.getFullYear()]
    }
  
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
      $http.get('/api/categories/onlyactive')
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
  
    //Remove reminder
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
  
    //Open Edit reminder Modal
    $scope.openEditReminderModal = function($reminderId){
      $scope.reminders.forEach(reminder => {
        if(reminder._id == $reminderId){
          $scope.editReminder.reminderId = reminder._id;
          $scope.editReminder.title = reminder.title;
          $scope.editReminder.lastDay = reminder.lastDayToPay.toString();
          $scope.editReminder.beginMonth = reminder.beginMonth.toString();
          $scope.editReminder.beginYear = reminder.beginYear.toString();
          $scope.editReminder.aproxAmount = reminder.aproxAmount;
          $scope.editReminder.note = reminder.note;
        }
      });
    }
  
    //Edit reminder
    $scope.submitEditReminder = function(){
      $http.put('/api/reminder' , $scope.editReminder)
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
  
      $scope.editReminder = {};
    }
  
    $scope.cleanNewReminderForm = function(){
      var categoryId = $scope.newReminder.categoryId;
      $scope.newReminder = {};
      $scope.newReminder.categoryId = categoryId;
    }
  
    $scope.cleanEditReminderForm = function(){
      var categoryId = $scope.editReminder.categoryId;
      $scope.editReminder = {};
      $scope.editReminder.categoryId = categoryId;
    }    
};