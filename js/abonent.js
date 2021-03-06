function hide() {
    $('#collapseOne').hide();
}

function addDate(){
    let monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь","июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
    
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    
    const dateRegistration = `${day} ${monthNames[month]} ${year}`;
    return dateRegistration
}

let bool1 = true;
let bool2 = true;
let arrayData = [];

let abonent = angular.module('Abonent', []);


abonent.controller('AbonentController', function ($scope, $http, $window) {
    $('#validator_filled').hide();
    $('#validator_correct').hide();
    $('#collapseOne').show();


    firebase.database().ref().orderByValue().on('value', snapshot => {
        const keyArr = Object.keys(snapshot.val());
        let obj = snapshot.val()
        let strJSON = JSON.stringify(obj)
        for (keyData of keyArr) {
            keyData += "";

            let oneAbonentInfo;

            JSON.parse(strJSON, (key, value) => {

                if (key == keyData) {
                    value.id = key
                    return oneAbonentInfo = value;
                }
                return value;
            });
            arrayData.unshift(oneAbonentInfo);
        }

        read();

        return null;

    });


    function read() {
        $http.put(`http://localhost`, JSON.stringify({}));

        $scope.abonent = arrayData;
        arrayData = [];
    }

    $scope.addAbonent = function () {

        $('#validator_filled').hide();
        $('#validator_correct').hide();

        if ($("#lastname_").val() == null || $("#firstname_").val() == null ||
            $("#middlename_").val() == null || $("#street_").val() == null ||
            $("#building_").val() == null || $("#flat_").val() == null ||
            $("#phone_").val() == null || $("#tarif_").val() == null ||
            $("#lastname_").val() == "" || $("#firstname_").val() == "" ||
            $("#middlename_").val() == "" || $("#street_").val() == "" ||
            $("#building_").val() == "" || $("#flat_").val() == "" ||
            $("#phone_").val() == "" || $("#tarif_").val() == ""
        ) {
            $('#validator_filled').show();

        } else if (!/([0-9]{11})+$/.test($("#phone_").val()) ||
            !/^[0-9]+$/.test($("#building_").val()) ||
            !/^[0-9]+$/.test($("#flat_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#lastname_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#firstname_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#middlename_").val())
        ) {
            $('#validator_correct').show();

        } else {

            let data = {
                lastname: $("#lastname_").val(),
                firstname: $("#firstname_").val(),
                middlename: $("#middlename_").val(),
                street: $("#street_").val(),
                building: $("#building_").val(),
                flat: $("#flat_").val(),
                phone: $("#phone_").val(),
                tarif: $("#tarif_").val(),
                date: addDate()
            };
            $(".collapse").collapse('hide');
            
            function write(data) {
                firebase.database().ref().push().set(data);
            }
            write(data);
        }
    }

    $scope.reWriteUpd = function (id, lastname, firstname, middlename, street, building, flat, phone, tarif) {

        if (bool2) {
            $('#collapseOne').show();
            $('#id_').show();
            $scope.addHide = false;
            $scope.updateHide = false;
            bool2 = false;
            bool1 = true;
        } else {
            $('#collapseOne').hide();
            $('#id_').hide();
            $scope.updateHide = true;
            $scope.addHide = false;
            bool2 = true;
        }

        $("#id_").val(id + "");
        $("#lastname_").val(lastname + "");
        $("#firstname_").val(firstname + "");
        $("#middlename_").val(middlename + "");
        $("#street_").val(street + "");
        $("#building_").val(building + "");
        $("#flat_").val(flat + "");
        $("#phone_").val(phone + "");
        $("#tarif_").val(tarif + "");

        console.log(lastname + " _ " + firstname + " _ " + middlename + " _ " + street + " _ " + building + " _ " + flat + " _ " + phone + " _ " + tarif);

    };

    $scope.updateAbonent = function () {

        $('#validator_filled').hide();
        $('#validator_correct').hide();

        if ($("#id_").val() == null || $("#lastname_").val() == null || $("#firstname_").val() == null ||
            $("#middlename_").val() == null || $("#street_").val() == null ||
            $("#building_").val() == null || $("#flat_").val() == null ||
            $("#phone_").val() == null || $("#tarif_").val() == null ||
            $("#id_").val() == "" || $("#lastname_").val() == "" || $("#firstname_").val() == "" ||
            $("#middlename_").val() == "" || $("#street_").val() == "" ||
            $("#building_").val() == "" || $("#flat_").val() == "" ||
            $("#phone_").val() == "" || $("#tarif_").val() == ""
        ) {
            $('#validator_filled').show();
        } else if (
            !/([0-9]{11})+$/.test($("#phone_").val()) ||
            !/^[0-9]+$/.test($("#building_").val()) ||
            !/^[0-9]+$/.test($("#flat_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#lastname_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#firstname_").val()) ||
            !/^[А-Яа-яЁё\s]+$/.test($("#middlename_").val())
        ) {
            $('#validator_correct').show();
        } else {

            const myKey = $("#id_").val();

            const newAbonent = {
                lastname: $("#lastname_").val(),
                firstname: $("#firstname_").val(),
                middlename: $("#middlename_").val(),
                street: $("#street_").val(),
                building: $("#building_").val(),
                flat: $("#flat_").val(),
                phone: $("#phone_").val(),
                tarif: $("#tarif_").val(),
                date: addDate()
            };

            $(".collapse").collapse('hide');

            firebase.database().ref().child(myKey).set(newAbonent);
        }
    };

    $scope.deleteAbonent = function (id) {
        firebase.database().ref().child(id).remove();
    };
});