document.addEventListener("DOMContentLoaded", function() {
    var modeOfTeachingSelect = document.getElementsByName("mode-of-teaching");
    var transportationGroup = document.getElementById("transportation-group");
    var distanceGroup = document.getElementById("distance-group");
    var genderRadios = document.querySelectorAll("#gender-id input[type='radio']");
    var otherGenderDiv = document.getElementById("other-gender");
    // Add event listener to each radio button for mode of teaching
    modeOfTeachingSelect.forEach(function(radio) {
        radio.addEventListener("change", function() {
            if (radio.value === "offline") {
                transportationGroup.style.display = "block";
                distanceGroup.style.display = "block";
            } else {
                transportationGroup.style.display = "none";
                distanceGroup.style.display = "none";
            }
        });
    });
    genderRadios.forEach(function(radio) {
        radio.addEventListener("change", function() {
            if (radio.value === "other") {
                otherGenderDiv.style.display = "block";
            } else {
                otherGenderDiv.style.display = "none";
            }
        });
    });
});