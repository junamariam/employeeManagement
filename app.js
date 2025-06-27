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
  // for (let i = 0; i < data.length; i++) {
  //   let employee = data[i];
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
    const formattedDob = formattedDate(form.dob.value);
    console.log(formattedDob);
    const data = {
      salutation: form.salutation.value,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      dob: formattedDob,
      gender: form.gender.value,
      qualifications: form.qualifications.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      country: form.country.value,
      username: form.userName.value,
      password: form.password.value,
    };

    try {
      const res = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(JSON.stringify(data));
      console.log("Status:", res.status);
      if (res.ok) {
        alert("Employee Registered");
        form.reset();
      } else alert("Registration failed");
    } catch (error) {
      console.error("Failed", error);
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
  }
  if (target.classList.contains("details-btn")) {
    console.log("details button clicked", employeeId);
  }
  if (target.classList.contains("delete-btn")) {
    alert("delete button clicked", employeeId);
  }
});
