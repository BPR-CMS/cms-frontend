describe("Admin registration flow", () => {
  // This test checks if the admin registration form is displayed when there is no admin
  it("should show the registration form if no admin exists", () => {
    // Intercept the API request and mock a response that indicates no admin exists
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 200,
        body: false, // Mock response indicating no admin exists
      }
    ).as("checkAdminExists");

    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Assert that the registration form should be visible
    cy.get("form#admin-registration").should("exist");
  });

  // This test checks if the admin registration form is not displayed when an admin exists
  it("should not show the  the registration form if an admin exists", () => {
    // Intercept the API request and mock a response that indicates an admin exists
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 200,
        body: true, // Mock response indicating an admin exists
      }
    ).as("checkAdminExists");

    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Assert that the registration form should not be visible
    cy.get("form#admin-registration").should("not.exist");
  });
});

describe("Admin registration, no admin exists", () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 200,
        body: false,
      }
    ).as("checkAdminExists");
  });

  // This test covers the successful registration of an admin
  it("should register the admin successfully", () => {
    // Intercept the POST request and mock a success response for admin registration
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 201,
        body: { message: "Admin registered successfully." },
      }
    ).as("registerAdmin");

    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("newadmin@example.com");
      cy.get('input[name="password"]').type("newPassword123");
      cy.get('input[name="confirmPassword"]').type("newPassword123");
      cy.get("button").click();
    });

    // Check for successful registration toast and redirection
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully created an admin account.");
    cy.location("pathname").should("eq", "/account");
  });

  // This test checks that 'adminExists' is set to 'true' in localStorage after successful registration
  it("should set 'adminExists' to 'true' in localStorage after successful registration", () => {
    // Intercept the API request and mock a success response for admin registration
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 201,
        body: { message: "Admin registered successfully." },
      }
    ).as("registerAdmin");

    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data
    cy.get("form#admin-registration").within(() => {
      cy.get('input[name="firstName"]').type("John");
      cy.get('input[name="lastName"]').type("Doe");
      cy.get('input[name="email"]').type("john.doe@example.com");
      cy.get('input[name="password"]').type("password123");
      cy.get('input[name="confirmPassword"]').type("password123");
      cy.get("button").click();
    });

    // Verify that 'adminExists' is set to 'true' in localStorage
    cy.window().its("localStorage.adminExists").should("eq", "true");
  });
});

describe("Validation", () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 200,
        body: false,
      }
    ).as("checkAdminExists");
    cy.visit("http://localhost:3000/");
  });

  // Test to ensure that the system shows an error toast when there's an attempt to register an admin while another admin already exists
  it("should show an error toast if an admin already exists", () => {
    // Simulate a failed registration attempt due to admin existence
    // Intercepting the API call and providing a mock response that indicates an admin account already exists
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/initialize",
      },
      {
        statusCode: 400,
        body: { message: "An admin account already exists." },
      }
    ).as("registerAdmin2");
    cy.visit("http://localhost:3000/");
    // Simulate user filling out the form with valid data
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Test Name");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("testPassword123");
      cy.get('input[name="confirmPassword"]').type("testPassword123");
      cy.get("button").click();
    });

    // Assert that the error toast appears, indicating that an admin account already exists
    cy.get(".destructive")
      .should("be.visible")
      .contains("An admin account already exists.");
  });

  // Test to ensure that an exclamation mark button appears when invalid input is typed into the form
  it("should display an exclamation mark button when invalid input is typed", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible");
  });

  // Test to ensure that the tooltip appears when the error icon is clicked
  it("should display tooltip when error icon is clicked", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Verify that the tooltip is displayed
    cy.get("#error-tooltip").should("be.visible");
  });

  // Test to ensure that the correct error message appears in the tooltip
  it("should display correct error message in tooltip", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
      )
      .should("be.visible");
  });

  // Test to ensure that the tooltip disappears when the error icon is clicked again
  it("should hide tooltip when error icon is clicked again", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Click the error icon again
    cy.get("#error-button").should("be.visible").click();
    // Verify that the tooltip is hidden
    cy.get("#error-tooltip").should("not.exist");
  });

  // Test to ensure that an error appears when the passwords entered in the form do not match
  it("should show an error for mismatched passwords", () => {
    cy.get("form#admin-registration").within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("newadmin@example.com");
      cy.get('input[name="password"]').type("password123");
      cy.get('input[name="confirmPassword"]').type("password321");
      cy.get("button").click();
    });
    // Verify that the mismatched passwords error message is displayed
    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
    cy.get(".destructive").should("contain.text", "Passwords do not match.");
  });

  // Test to ensure that the 'Let's start' button is disabled if the form is invalid
  it("should disable the 'Let's start' button if the form is invalid", () => {
    cy.get("button").should("be.disabled");
  });
});
