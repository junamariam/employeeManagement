//Date format change
function formattedDate(inputDate) {
  const splittedDate = inputDate.split("-");
  const formattedDob = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  return formattedDob;
}
async function getEmployees() {
  try {
    let response = await fetch("http://localhost:3000/employees");
    const data = await response.json();
    renderEmployees(data);
  } catch (error) {
    console.log("Failed", error);
  }
}

const renderEmployees = (data) => {
  let tableBody = document.getElementById("tbody");
  let rows = " ";
  data.forEach((employee, index) => {
    rows += `<tr>
        <td>${index + 1}</td>
        <td>${employee.salutation}.${employee.firstName} ${
      employee.lastName
    }</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${employee.gender}</td>
        <td>${employee.dob}</td>
        <td>${employee.country}</td>
        <td><div class="dropdown" id="eclipseMenu">
  <button class="btn " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="material-symbols-outlined">
more_vert
</span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item details-btn" href="#" data-id="${
      employee.id
    }"  >View Details</a></li>
    <li><a class="dropdown-item edit-btn" href="#"data-id="${
      employee.id
    }">Edit</a></li>
    <li><a class="dropdown-item delete-btn" href="#"data-id="${
      employee.id
    }" >Delete</a></li>
  </ul>
</div></td>
      </tr>`;
  });

  tableBody.innerHTML = rows;
};

getEmployees();

// Button functionality-Registration form pop-up
document
  .getElementById("addEmployeeBtn")
  .addEventListener("click", async () => {
    const modalEl = document.getElementById("modalWindow");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  });

//Submit button functionality
document.addEventListener("submit", async (event) => {
  if (event.target && event.target.id === "employeeForm") {
    event.preventDefault();

    const form = event.target;

    // 👉 Step 1: Collect all text fields as JSON
    const newEmployee = {
      salutation: form.salutation.value,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,

      gender: form.gender.value,
      qualifications: form.qualifications.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      country: form.country.value,
      username: form.userName.value,
      password: form.password.value,
      dob: formattedDate(form.dob.value),
    };

    try {
      // 👉 Step 2: First POST request: Save text fields (JSON)
      const res = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (res.ok) {
        const savedEmployee = await res.json(); // Get newly created employee object with ID
        const employeeId = savedEmployee.id;

        // 👉 Step 3: Now check if user uploaded an image
        const imgUpload = document.getElementById("imgUpload");
        if (imgUpload && imgUpload.files.length > 0) {
          const formData = new FormData();
          formData.append("avatar", imgUpload.files[0]);

          const imageRes = await fetch(
            `http://localhost:3000/employees/${employeeId}/avatar`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (imageRes.ok) {
            alert("Employee registered with image!");
          } else {
            alert("Employee saved, but image upload failed.");
          }
        } else {
          alert("Employee registered (no image uploaded).");
        }

        form.reset();
      } else {
        alert("Failed to register employee.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }
});

const cancelBtn = document.getElementById("cancel-btn");
cancelBtn.addEventListener("click", async (event) => {
  if (event.target && event.target.id === "cancel-btn") {
    const form = document.getElementById("employeeForm");
    form.reset();
  }
});
//Vertical eclipse functionality
document.getElementById("tbody").addEventListener("click", (event) => {
  const target = event.target;
  const employeeId = target.getAttribute("data-id");
  if (target.classList.contains("edit-btn")) {
    console.log("Edit button clicked", employeeId);
    fetch(`http://localhost:3000/employees/${employeeId}`)
      .then((response) => response.json())
      .then((employee) => {
        document.getElementById("firstName").value = employee.firstName;
        console.log(document.getElementById("firstName").value);
        document.getElementById("lastName").value = employee.lastName;
        document.getElementById("email").value = employee.email;
        document.getElementById("mobileNumber").value = employee.phone;
        document.getElementById("dob").value = employee.dob;
        document.getElementById("qualifications").value =
          employee.qualifications;
        document.getElementById("address").value = employee.address;
        document.getElementById("city").value = employee.city;
        document.getElementById("state").value = employee.state;
        document.getElementById("country").value = employee.country;
        document.getElementById("userName").value = employee.username;
        document.getElementById("password").value = employee.password;
        document.getElementById(
          "employeeAvatar1"
        ).src = `http://localhost:3000/employees/${employeeId}/avatar`;
        document.getElementById("employeeId").value = employee.id;
        const modalEl = document.getElementById("modalWindow");
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      });
    document.getElementById("imgUpload").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const avatarImg = document.getElementById("employeeAvatar1");
          avatarImg.src = e.target.result;
          avatarImg.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (target.classList.contains("details-btn")) {
    fetch(`http://localhost:3000/employees/${employeeId}`)
      .then((res) => res.json())
      .then((employee) => {
        document.getElementById(
          "name1"
        ).innerText = `${employee.salutation} ${employee.firstName} ${employee.lastName} `;
        document.getElementById("email1").innerText = `${employee.email}`;
        //document.getElementById("age1").value = employee.age;
        document.getElementById("gender1").value = employee.gender;
        document.getElementById("dob1").value = employee.dob;
        document.getElementById("qualification1").value =
          employee.qualifications;
        document.getElementById("address1").value = employee.address;
        document.getElementById("username1").value = employee.username;
        document.getElementById(
          "employeeAvatar"
        ).src = `http://localhost:3000/employees/${employeeId}/avatar`;
        //Age calculation
        const splittedDob = employee.dob.split("-");
        const year = parseInt(splittedDob[2]);
        const month = parseInt(splittedDob[1]) - 1;
        const day = parseInt(splittedDob[0]);
        const dateOfBirth = new Date(year, month, day);
        const today = new Date();

        const age = today.getFullYear() - dateOfBirth.getFullYear();
        const m = today.getMonth() - dateOfBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
          age--;
        }
        document.getElementById("age1").value = age;

        const modalElmnt = document.getElementById("viewModal");
        const modali = new bootstrap.Modal(modalElmnt);
        modali.show();
      });
  }
  if (target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this employee?")) {
      fetch(`http://localhost:3000/employees/${employeeId}`, {
        method: "delete",
      }).then((res) => {
        if (res.ok) {
          alert("Employee Deleted");
          getEmployees();
        } else {
          alert("Failed to deete the employee");
        }
      });
    }
  }
});
