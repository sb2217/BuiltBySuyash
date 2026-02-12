/* ====================================================================== */
/* PORTFOLIO INTERACTIONS SCRIPT                                          */
/* ====================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================================== */
  /* REVEAL ANIMATION (INTERSECTION OBSERVER)                              */
  /* ==================================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==================================================================== */
  /* MOUSE TILT EFFECT                                                     */
  /* ==================================================================== */

  const tiltCards = document.querySelectorAll(".tilt");

  tiltCards.forEach(card => {

    card.addEventListener("mousemove", (event) => {

      const rect = card.getBoundingClientRect();

      const xPos =
        (event.clientX - rect.left) / rect.width - 0.5;

      const yPos =
        (event.clientY - rect.top) / rect.height - 0.5;

      /* Clamp values to avoid extreme rotation */
      const rotateX = Math.max(Math.min(-yPos * 6, 6), -6);
      const rotateY = Math.max(Math.min(xPos * 6, 6), -6);

      card.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });

  /* ==================================================================== */
  /* GITHUB PROJECTS FETCH                                                 */
  /* ==================================================================== */

  const projectsContainer = document.getElementById("github-projects");

  let allRepositories = [];

  if (projectsContainer) {

    fetch("https://api.github.com/users/sb2217/repos")

      .then(response => response.json())

      .then(repos => {

        allRepositories = repos;

        renderRepositories("all");

      })

      .catch(error => {

        projectsContainer.innerHTML =
          "<p class='muted'>Unable to load GitHub projects.</p>";

        console.error("GitHub API Error:", error);

      });

  }

  /* ==================================================================== */
  /* RENDER REPOSITORIES                                                   */
  /* ==================================================================== */

  function renderRepositories(language) {

    projectsContainer.innerHTML = "";

    allRepositories
      .filter(repo => language === "all" || repo.language === language)
      .forEach(repo => {

        const card = document.createElement("div");

        card.className = "project-card reveal tilt";

        card.innerHTML = `
          <h4>${repo.name}</h4>
          <p>${repo.description || "No description provided."}</p>
          <span class="project-tag">${repo.language || "Mixed"}</span>
        `;

        card.addEventListener("click", () => {

          window.open(
            repo.html_url + "#readme",
            "_blank"
          );

        });

        projectsContainer.appendChild(card);

        /* Observe newly added cards */
        revealObserver.observe(card);

        /* Apply tilt behavior */
        attachTilt(card);

      });

  }

  /* ==================================================================== */
  /* FILTER BUTTON HANDLING                                                */
  /* ==================================================================== */

  const filterButtons =
    document.querySelectorAll(".filter-bar button");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      renderRepositories(button.dataset.lang);

    });

  });

  /* ==================================================================== */
  /* HELPER: ATTACH TILT TO DYNAMIC CARDS                                  */
  /* ==================================================================== */

  function attachTilt(card) {

    card.addEventListener("mousemove", (event) => {

      const rect = card.getBoundingClientRect();

      const xPos =
        (event.clientX - rect.left) / rect.width - 0.5;

      const yPos =
        (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = Math.max(Math.min(-yPos * 6, 6), -6);
      const rotateY = Math.max(Math.min(xPos * 6, 6), -6);

      card.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

  }

});

/* ====================================================================== */
/* END OF FILE                                                             */
/* ====================================================================== */
