function loadAdminData() {
  const currentUser = JSON.parse(localStorage.getItem("summitLoggedInUser"));

  if (!currentUser || !currentUser.isAdmin) {
    showPage("auth");
    setAuthMessage("Admin access required.", true);
    return;
  }

  const users = JSON.parse(localStorage.getItem("summitUsers")) || [];
  const tickets = JSON.parse(localStorage.getItem("summitTickets")) || [];
  const vipUsers = users.filter((user) => user.vip);

  document.getElementById("totalCustomers").textContent = users.filter((user) => !user.isAdmin).length;
  document.getElementById("totalTickets").textContent = tickets.length;
  document.getElementById("totalVipCustomers").textContent = vipUsers.filter((user) => !user.isAdmin).length;

  loadAdminTickets();
  loadCustomers();
}

function loadAdminTickets() {
  const tickets = JSON.parse(localStorage.getItem("summitTickets")) || [];
  const container = document.getElementById("tickets");

  if (!container) return;

  if (tickets.length === 0) {
    container.innerHTML = "<div class='ticket-item'>No support tickets yet.</div>";
    return;
  }

  container.innerHTML = tickets
    .map(
      (ticket) => `
        <div class="ticket-item">
          <h4>${ticket.name} • ${ticket.email}</h4>
          <p><strong>Service:</strong> ${ticket.service}</p>
          <p><strong>Budget:</strong> ${ticket.budget}</p>
          <p><strong>Submitted:</strong> ${ticket.createdAt}</p>
          <p>${ticket.message}</p>
        </div>
      `
    )
    .join("");
}

function loadCustomers() {
  const users = JSON.parse(localStorage.getItem("summitUsers")) || [];
  const container = document.getElementById("customerList");

  if (!container) return;

  const customers = users.filter((user) => !user.isAdmin);

  if (customers.length === 0) {
    container.innerHTML = "<div class='customer-item'>No customer accounts yet.</div>";
    return;
  }

  container.innerHTML = customers
    .map(
      (user) => `
        <div class="customer-item">
          <h4>${user.name}</h4>
          <p><strong>Email:</strong> ${user.email}</p>
          <p>
            ${
              user.vip
                ? "<span class='vip-pill'>VIP Client</span>"
                : "<span class='standard-pill'>Standard Client</span>"
            }
          </p>
          <p><strong>Discount:</strong> ${user.vip ? "VIP Discount Enabled" : "No active discount"}</p>
        </div>
      `
    )
    .join("");
}

function grantVIP() {
  const vipEmailInput = document.getElementById("vipUser");
  const email = vipEmailInput.value.trim().toLowerCase();

  if (!email) {
    alert("Enter a customer email first.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("summitUsers")) || [];
  const userIndex = users.findIndex((user) => user.email === email && !user.isAdmin);

  if (userIndex === -1) {
    alert("Customer not found.");
    return;
  }

  users[userIndex].vip = true;
  users[userIndex].discount = "VIP Discount Enabled";
  localStorage.setItem("summitUsers", JSON.stringify(users));

  const loggedIn = JSON.parse(localStorage.getItem("summitLoggedInUser"));
  if (loggedIn && loggedIn.email === email) {
    localStorage.setItem("summitLoggedInUser", JSON.stringify(users[userIndex]));
  }

  vipEmailInput.value = "";
  alert("VIP access granted.");
  loadAdminData();
}