// Global State Storage
let globalIssuesCollection = [];
const BASE_SERVER_API = "https://phi-lab-server.vercel.app/api/v1/lab";

// Toggle Visibility of Spinner Component
const toggleLoaderVisibility = (isVisible) => {
  const UI_Spinner = document.getElementById("ui-loader");
  if (isVisible) {
    UI_Spinner.classList.remove("hidden");
  } else {
    UI_Spinner.classList.add("hidden");
  }
};

// Render Engine: Generates Layout Grid dynamically
const renderIssueCards = (issuesDataset) => {
  const layoutContainer = document.getElementById("issues-wrapper");
  layoutContainer.innerHTML = "";

  document.getElementById("issues-count").innerText = issuesDataset.length;

  issuesDataset.forEach((ticket) => {
    const cardElement = document.createElement("article");

    // Status color configurations mappings
    const statusStripeColor =
      ticket.status === "open" ? "bg-emerald-500" : "bg-purple-500";
    const statusIconPath =
      ticket.status === "open"
        ? "../assets/Open-Status.png"
        : "../assets/Closed- Status .png";

    cardElement.innerHTML = `
      <div onclick="fetchTargetIssueDetails(${ticket.id})" class="bg-white rounded-xl border border-slate-100 h-[310px] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between">
        <div>
          <div class="${statusStripeColor} h-1.5 w-full"></div> 
          <div class="p-5">
              <div class="flex justify-between items-center mb-3">
                  <img src="${statusIconPath}" alt="Status Sign" class="w-5 h-5 object-contain">
                  <span class="text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-0.5 rounded-md uppercase">${ticket.priority}</span>
              </div>

              <h3 class="font-bold text-slate-800 text-sm mb-1.5 line-clamp-2 leading-snug">
                  ${ticket.title}
              </h3>
              <p class="text-xs text-slate-400 mb-3 line-clamp-2">
                  ${ticket.description}
              </p>

              <div class="flex flex-wrap gap-1.5">
                ${ticket.labels
                  .map(
                    (tag) => `
                  <span class="text-[9px] font-bold bg-rose-50 text-rose-500 border border-rose-100 px-2 py-0.5 rounded uppercase tracking-wide">
                    ${tag}
                  </span>
                `,
                  )
                  .join("")}
              </div>
          </div>
        </div>
        
        <div class="p-5 pt-0">
          <div class="pt-3 border-t border-slate-100 flex flex-col gap-0.5">
              <p class="text-[10px] text-slate-400 font-semibold">#${ticket.id} by ${ticket.author}</p>
              <p class="text-[10px] text-slate-400">${ticket.updatedAt}</p>
          </div>
        </div>
      </div>
    `;
    layoutContainer.appendChild(cardElement);
  });

  toggleLoaderVisibility(false);
};

// UI Filter Tab State Swapper
const activeTabButtons = document.querySelectorAll(
  "#filter-trigger-group button",
);
activeTabButtons.forEach((clickedBtn) => {
  clickedBtn.addEventListener("click", () => {
    activeTabButtons.forEach((btn) => {
      btn.classList.remove("bg-purple-600", "text-white");
      btn.classList.add("btn-outline", "text-slate-500", "border-slate-200");
    });
    clickedBtn.classList.add("bg-purple-600", "text-white");
    clickedBtn.classList.remove(
      "btn-outline",
      "text-slate-500",
      "border-slate-200",
    );
  });
});

// Initialization Core Request
const bootstrapApplication = async () => {
  toggleLoaderVisibility(true);
  try {
    const networkResponse = await fetch(`${BASE_SERVER_API}/issues`);
    const parsedPayload = await networkResponse.json();
    globalIssuesCollection = parsedPayload.data;
    renderIssueCards(globalIssuesCollection);
  } catch (error) {
    console.error("API Fetch Error:", error);
    toggleLoaderVisibility(false);
  }
};

// Event Subscriptions for Filtering
document.getElementById("filter-open").addEventListener("click", () => {
  toggleLoaderVisibility(true);
  renderIssueCards(
    globalIssuesCollection.filter((item) => item.status === "open"),
  );
});

document.getElementById("filter-closed").addEventListener("click", () => {
  toggleLoaderVisibility(true);
  renderIssueCards(
    globalIssuesCollection.filter((item) => item.status === "closed"),
  );
});

document.getElementById("filter-all").addEventListener("click", () => {
  toggleLoaderVisibility(true);
  renderIssueCards(globalIssuesCollection);
});

// Detailed View Handler (Modal)
const fetchTargetIssueDetails = async (issueId) => {
  try {
    const detailResponse = await fetch(`${BASE_SERVER_API}/issue/${issueId}`);
    const detailPayload = await detailResponse.json();
    populateModalDOM(detailPayload.data);
    document.getElementById("details_view_modal").showModal();
  } catch (err) {
    console.error("Error displaying ticket details:", err);
  }
};

// Modal Renderer Inner DOM Structure
const populateModalDOM = (targetData) => {
  const wrapperNode = document.getElementById("modal-content-area");

  wrapperNode.innerHTML = `
    <div class="p-6 bg-slate-50 border-b border-slate-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-full text-white bg-emerald-500 shadow-sm">${targetData.status}</span>
        <span class="text-xs text-slate-400 font-medium">Ticket ID: #${targetData.id}</span>
      </div>
      <h2 class="text-xl font-black text-slate-800 leading-tight">${targetData.title}</h2>
      <p class="text-xs text-slate-500 mt-1">Maintained by <span class="font-bold text-slate-700">${targetData.assignee}</span> • Compiled: 22/12/2024</p>
    </div>

    <div class="p-6 space-y-4">
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Overview</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${targetData.description}</p>
      </div>
      
      <div class="flex flex-wrap gap-1.5 pt-2">
        ${targetData.labels
          .map(
            (tag) => `
          <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200 uppercase">${tag}</span>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="bg-purple-900 text-white p-6 flex justify-between items-center">
      <div>
        <p class="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Assignee</p>
        <p class="font-extrabold text-sm text-white mt-0.5">${targetData.assignee}</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1">Severity Level</p>
        <span class="px-4 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-lg uppercase tracking-wider">${targetData.priority}</span>
      </div>
    </div>
  `;
};

// Live Server Search Operations Engine
const queryRemoteDatabase = async (searchToken) => {
  toggleLoaderVisibility(true);
  try {
    const rawResult = await fetch(
      `${BASE_SERVER_API}/issues/search?q=${searchToken}`,
    );
    const dynamicData = await rawResult.json();
    renderIssueCards(dynamicData.data);
  } catch (ex) {
    console.error("Search API Error:", ex);
    toggleLoaderVisibility(false);
  }
};

// Search Input Listener Setup
document
  .getElementById("search-filter-input")
  .addEventListener("keyup", (event) => {
    const currentToken = event.target.value.trim();
    if (currentToken === "") {
      renderIssueCards(globalIssuesCollection);
    } else {
      queryRemoteDatabase(currentToken);
    }
  });

// Boot Action Trigger
bootstrapApplication();
