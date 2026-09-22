document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     MOBILE NAVIGATION
  ============================== */

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {

      const open = nav.classList.toggle("open");

      toggle.setAttribute("aria-expanded", String(open));

      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );

    });

    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        toggle.setAttribute("aria-expanded", "false");

        toggle.setAttribute(
          "aria-label",
          "Open navigation"
        );

      });

    });

  }


  /* ==============================
     SCROLL REVEAL ANIMATION
  ============================== */

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, obs) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            obs.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });

  } else {

    revealItems.forEach(item => {
      item.classList.add("visible");
    });

  }


  /* ==============================
     CONTACT FORM
     GOOGLE SHEETS INTEGRATION
  ============================== */

  const form = document.querySelector("#contact-form");

  if (form) {

    const status = document.querySelector("#form-status");
    const submitButton =
      form.querySelector('button[type="submit"]');


    /*

      IMPORTANT:
      Replace this with your Google Apps Script
      Web App URL after creating the Google Sheet.

    */

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwlarWHxn1B7v-ATH66tEF5Bjni-GrKOEgAVqk_mujCgY2nNI4ML8137nwx26SGo4Pr/exec";


    /* ==============================
       FORM SUBMISSION
    ============================== */

    form.addEventListener("submit", async (event) => {

      event.preventDefault();


      /* Get form values */

      const name =
        form.name.value.trim();

      const email =
        form.email.value.trim();

      const subject =
        form.subject.value.trim();

      const message =
        form.message.value.trim();


      /* Reset status */

      status.className = "form-status";
      status.textContent = "";


      /* ==============================
         VALIDATION
      ============================== */

      if (!name || !email || !subject || !message) {

        status.textContent =
          "Please complete all fields before submitting.";

        status.classList.add("error");

        return;

      }


      /* Email validation */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        status.textContent =
          "Please enter a valid email address.";

        status.classList.add("error");

        return;

      }


      /* ==============================
         CHECK GOOGLE SCRIPT URL
      ============================== */

      if (
        !GOOGLE_SCRIPT_URL ||
        GOOGLE_SCRIPT_URL ===
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
      ) {

        status.textContent =
          "The contact form is not connected yet. Please add the Google Apps Script URL.";

        status.classList.add("error");

        return;

      }


      /* ==============================
         BUTTON LOADING STATE
      ============================== */

      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "Sending...";

      }

      status.textContent =
        "Sending your message...";


      /* ==============================
         PREPARE DATA
      ============================== */

      const formData =
        new URLSearchParams();


      formData.append(
        "name",
        name
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "subject",
        subject
      );

      formData.append(
        "message",
        message
      );


      /* ==============================
         SEND TO GOOGLE SHEETS
      ============================== */

      try {

        await fetch(
          GOOGLE_SCRIPT_URL,
          {
            method: "POST",

            body: formData,

            mode: "no-cors"
          }
        );


        /* ==============================
           SUCCESS MESSAGE
        ============================== */

        status.className =
          "form-status success";

        status.textContent =
          `Thanks, ${name}. Your message has been sent successfully! I'll get back to you soon.`;


        /* Clear form */

        form.reset();


      } catch (error) {

        console.error(
          "Contact form error:",
          error
        );


        /* ==============================
           ERROR MESSAGE
        ============================== */

        status.className =
          "form-status error";

        status.textContent =
          "Something went wrong. Please try again or contact me directly by email.";

      }


      /* ==============================
         RESTORE BUTTON
      ============================== */

      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          "Send Message ↗";

      }

    });

  }

});