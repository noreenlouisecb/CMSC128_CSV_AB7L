(function() {
  'use strict';

  angular
    .module('app')
    .controller('CourseCtrl', CourseCtrl);

  CourseCtrl.$inject = ["$scope", "$location", "$http", "CourseService"];

  function CourseCtrl($scope, $location, $http, CourseService) {
    $scope.faculty_user_courses = [];
    $scope.faculty_user_info = [];

    // Update User Details
    let user_id;
    let oclass;
    let ogname;
    let omname;
    let olname;
    let uname;
    let gnchanged = false;
    let mnchanged = false;
    let lnchanged = false;
    let clchanged = false;
    let namep = new RegExp("[A-Za-z\.\-\s]*[A-Za-z\.\-\s]+");

    $scope.Get_User = function() {
      CourseService.Get_User()
        .then(function(data){
          $scope.faculty_user_info = [];
          $scope.faculty_user_info.push(data);
          user_id = data.id;
          oclass = data.classification;
          ogname = data.given_name;
          omname = data.middle_name;
          olname = data.last_name;
          uname = data.username;
          $scope.selectd = {
          	repeatSelect: null,
          	options: [
          		{id: "Instructor I", name: "Instructor I"},
          		{id: "Instructor II", name: "Instructor II"},
          		{id: "Instructor III", name: "Instructor III"},
          		{id: "Instructor IV", name: "Instructor IV"},
          		{id: "Instructor V", name: "Instructor V"},
          		{id: "Instructor VI", name: "Instructor VI"},
          		{id: "Assistant Professor I", name: "Assistant Professor I"},
          		{id: "Assistant Professor II", name: "Assistant Professor II"},
          		{id: "Assistant Professor III", name: "Assistant Professor III"},
          		{id: "Assistant Professor IV", name: "Assistant Professor IV"},
          		{id: "Assistant Professor V", name: "Assistant Professor V"},
          		{id: "Assistant Professor VI", name: "Assistant Professor VI"},
          		{id: "Professor I", name: "Professor I"},
          		{id: "Professor II", name: "Professor II"},
          		{id: "Professor III", name: "Professor III"},
          		{id: "Professor IV", name: "Professor IV"},
          		{id: "Professor V", name: "Professor V"},
          		{id: "Professor VI", name: "Professor VI"}
          	]
          };
        });
    }

   $scope.Get_Course = function() {
      CourseService.Get_Course(user_id)
        .then(function(data) {
          $scope.faculty_user_courses = [];
          for(let i = 0; i < data.length; i++) {
            CourseService.Get_Lecture(data[i].id)
              .then(function(data2) {
                  $scope.faculty_user_courses.push({
                    'code': data[i].code,
                    'course_id': data[i].course_id,
                    'description': data[i].description,
                    'faculty_user_id': data[i].faculty_user_id,
                    'id': data[i].id,
                    'title': data[i].title,
                    'lecture' : data2
                  });
              });
          }
        });


    }

    $scope.Add_Course = function() {
      CourseService.Add_Course($scope.newCourse)
      .then(function(data) {
        $scope.newCourse.course_code = "";
        $scope.newCourse.course_title = "";
        $scope.newCourse.course_description = "";
        $scope.faculty_user_courses.push(data);
        Materialize.toast('Course added!', 5000, 'rounded');
        $('#addModal').closeModal();
      });

      CourseService.Get_Course()
      .then(function(data) {
       });

      CourseService.Get_Course()
      .then(function(data) {
        $scope.faculty_user_courses = [];
        for(let i = 0; i < data.length; i++) {
          $scope.faculty_user_courses.push(data[i]);
        }
      });
    }

    $scope.openModal = function(c_id) {
      $("#editModal").openModal();
      localStorage.setItem("Course_id", c_id);
    }


    $scope.Edit_Course = function() {
      CourseService.Edit_Course(localStorage.getItem("Course_id"), $scope.course)
        .then(function(data) {
          $scope.course.course_code = "";
          $scope.course.course_title = "";
          $scope.course.course_description = "";
          $('#editModal').closeModal();
        });
        Materialize.toast('Course Details Updated!', 5000, 'rounded');


        CourseService.Get_Course()
          .then(function(data) {
            $scope.faculty_user_courses = [];
            for(let i = 0; i < data.length; i++) {
              $scope.faculty_user_courses.push(data[i]);
            }
          });
    }

    $scope.Delete_Course = function(id) {
      CourseService.Delete_Course(id)
        .then(function(data){ });

      CourseService.Get_Course()
        .then(function(data) {
          $scope.faculty_user_courses = [];
          for(let i = 0; i < data.length; i++) {
            $scope.faculty_user_courses.push(data[i]);
          }
        });
    }

    $scope.Get_Selected_Course = function(c_id, lecture_name) {
      localStorage.setItem("Course_id", c_id);
      localStorage.setItem("Lecture_name", lecture_name);
      window.location.href='/class';
    }

    // Update USER Details
  	$scope.Update_Details = function() {

		var err = false;		
		var npassw = document.querySelector('#password-input').value;
		var cpassw = document.querySelector('#confirm-password').value;

		if(npassw!==""){
			if (npassw!==cpassw){
				Materialize.toast('Password do not match!', 3000, 'rounded');
				err = true;
			}
			else{
				$http.post(
					'faculty_user/update_password/',
					{username: uname, password: npassw}
				);
			}
		}
		
		if((!clchanged)&&(gnchanged || mnchanged || lnchanged)){
			var ngname = document.querySelector('#fname-input').value;
			var nmname = document.querySelector('#mname-input').value;
			var nlname = document.querySelector('#lname-input').value;
			if (ngname===""){
				Materialize.toast('Given Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(ngname))){
				Materialize.toast('Invalid Given Name format!', 3000, 'rounded');
				err = true;
			}
			if (nmname===""){
				Materialize.toast('Middle Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(ngname))){
				Materialize.toast('Invalid Middle Name format!', 3000, 'rounded');
				err = true;
			}
			if (nlname===""){
				Materialize.toast('Last Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(nlname))){
				Materialize.toast('Invalid Last Name format!', 3000, 'rounded');
				err = true;
			}
			if(!err){
				$http.post(
					'faculty_user/update_name/',
					{given_name: ngname, middle_name: nmname, last_name: nlname, username: uname}
				);
				ogname = ngname;
				omname = nmname;
				olname = nlname;
				$scope.faculty_user_info[0].given_name = ngname;
				$scope.faculty_user_info[0].middle_name = nmname;
				$scope.faculty_user_info[0].last_name = nlname;
			}
		}

		else if(clchanged&&(gnchanged || mnchanged || lnchanged)){
			var ngname = document.querySelector('#fname-input').value;
			var nmname = document.querySelector('#mname-input').value;
			var nlname = document.querySelector('#lname-input').value;
			var nclass = document.querySelector('#classification-input').value;

			if (ngname===""){
				Materialize.toast('Given Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(ngname))){
				Materialize.toast('Invalid Given Name format!', 3000, 'rounded');
				err = true;
			}
			if (nmname===""){
				Materialize.toast('Middle Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(ngname))){
				Materialize.toast('Invalid Middle Name format!', 3000, 'rounded');
				err = true;
			}
			if (nlname===""){
				Materialize.toast('Last Name can not be blank!', 3000, 'rounded');
				err = true;
			}
			if (!(namep.test(nlname))){
				Materialize.toast('Invalid Last Name format!', 3000, 'rounded');
				err = true;
			}
			if(!err){
				$http.post(
					'faculty_user/update_profile/',
					{given_name: ngname, middle_name: nmname, last_name: nlname, classification: nclass, username: uname}
				);
				ogname = ngname;
				omname = nmname;
				olname = nlname;
				oclass = nclass;
				$scope.faculty_user_info[0].given_name = ngname;
				$scope.faculty_user_info[0].middle_name = nmname;
				$scope.faculty_user_info[0].last_name = nlname;
				$scope.faculty_user_info[0].classification = nclass;
			}
		}
		else if(clchanged){
			var nclass = document.querySelector('#classification-input').value;
			$http.post(
				'faculty_user/update_classification/',
				{username: uname, classification: nclass}
			);
			oclass=nclass;
			$scope.faculty_user_info[0].classification = nclass;
		}

		if((!err) && (gnchanged || mnchanged || lnchanged || clchanged || (npassw!==""))) Materialize.toast('Profile updated!', 3000, 'rounded');
	}

	$scope.check_password_changes = function() {
		var npassw = document.querySelector('#password-input').value;
		var cpassw = document.querySelector('#confirm-password').value;
		
		if (npassw===""){
			document.querySelector('#confirm-password').value = "";
			$('#confirm-password').attr('disabled','disabled');
			
		}
		else if(npassw.length>=8){
			$('#confirm-password').removeAttr('disabled');
		}
	}
	
	$scope.check_confirm_password = function(){
		var npassw = document.querySelector('#password-input').value;
		var cpassw = document.querySelector('#confirm-password').value;
		if (cpassw===""){
			if($('#password-input').hasClass('invalid')){
				$('#password-input').removeClass('invalid');	
			}
			if($('#confirm-password').hasClass('invalid')){
				$('#confirm-password').removeClass('invalid');	
			}
		}
		else if (npassw!==cpassw){
			if(!($('#password-input').hasClass('invalid'))){
				$('#password-input').addClass('invalid');
			}
			if(!($('#confirm-password').hasClass('invalid'))){
				$('#confirm-password').addClass('invalid');	
			}
		}
		else{
			if($('#password-input').hasClass('invalid')){
				$('#password-input').removeClass('invalid');	
			}
			if($('#confirm-password').hasClass('invalid')){
				$('#confirm-password').removeClass('invalid');	
			}
		}
	}
	
	$scope.check_classification = function(){
		var nclass = document.querySelector('#classification-input').value;
		if(oclass===nclass) clchanged = false;
		else clchanged = true;
	}

	$scope.check_gname_changes = function() {
		var ngname = document.querySelector('#fname-input').value;
		if (ogname===ngname) gnchanged=false;
		else gnchanged = true;
	}

	$scope.check_mname_changes = function() {
		var nmname = document.querySelector('#mname-input').value;
		if (omname===nmname) mnchanged=false;
		else mnchanged = true;
	}

	$scope.check_lname_changes = function() {
		var nlname = document.querySelector('#lname-input').value;
		if (olname===nlname) lnchanged=false;
		else lnchanged = true;
	}
  }
})();
