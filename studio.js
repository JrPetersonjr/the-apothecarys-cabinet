/**
 * WebStudio — Creative Suite Architecture (Dreamweaver / InDesign / Compositor Hybrid)
 * State Management, Live Preview Bridge, Inventory Matrix, Invoicing Engine, & Compositor Bridge
 */

(function () {
  'use strict';

  // ── State Definition ──────────────────────────────────────────────────────
  let studioState = {
    activeWorkspace: "designer", // designer, inventory, payments, invoices, compositor, export
    activeViewport: "desktop",   // desktop, tablet, mobile
    selectedProductId: null,
    products: [],
    config: {},
    orders: [],
    dirty: false
  };

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // ── Initialization & Storage Sync ─────────────────────────────────────────
  function loadInitialState() {
    // Read from localStorage (synced with storefront)
    const storedProds = localStorage.getItem("apothecary_products");
    const storedConfig = localStorage.getItem("apothecary_config");
    const storedOrders = localStorage.getItem("apothecary_orders");

    if (storedProds) {
      studioState.products = JSON.parse(storedProds);
    }
    if (storedConfig) {
      studioState.config = JSON.parse(storedConfig);
    }
    if (storedOrders) {
      studioState.orders = JSON.parse(storedOrders);
    }

    if (studioState.products.length > 0) {
      studioState.selectedProductId = studioState.products[0].id;
    }

    refreshAllPanels();
  }

  function saveStudioState(syncPreview = true) {
    localStorage.setItem("apothecary_products", JSON.stringify(studioState.products));
    localStorage.setItem("apothecary_config", JSON.stringify(studioState.config));
    localStorage.setItem("apothecary_orders", JSON.stringify(studioState.orders));

    studioState.dirty = true;
    updateStatusBar();

    if (syncPreview) {
      const iframe = $("#preview-iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "STUDIO_UPDATE_PRODUCTS",
          products: studioState.products
        }, "*");
        iframe.contentWindow.postMessage({
          type: "STUDIO_UPDATE_CONFIG",
          config: studioState.config
        }, "*");
      }
    }
  }

  // ── UI Workspace Switcher ─────────────────────────────────────────────────
  function setWorkspace(wsName) {
    studioState.activeWorkspace = wsName;
    $$(".ws-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.ws === wsName));
    $$(".tool-btn[data-ws]").forEach(btn => btn.classList.toggle("active", btn.dataset.ws === wsName));

    // Show/hide stage vs view panels
    const stage = $("#preview-stage");
    const invPanel = $("#panel-inventory");
    const payPanel = $("#panel-payments");
    const invcPanel = $("#panel-invoices");
    const compPanel = $("#panel-compositor");
    const expPanel = $("#panel-export");

    if (stage) stage.style.display = wsName === "designer" ? "flex" : "none";
    if (invPanel) invPanel.classList.toggle("active", wsName === "inventory");
    if (payPanel) payPanel.classList.toggle("active", wsName === "payments");
    if (invcPanel) invcPanel.classList.toggle("active", wsName === "invoices");
    if (compPanel) compPanel.classList.toggle("active", wsName === "compositor");
    if (expPanel) expPanel.classList.toggle("active", wsName === "export");

    // Refresh view specific content
    if (wsName === "inventory") renderInventoryTable();
    if (wsName === "invoices") renderInvoicesTable();
    if (wsName === "payments") renderPaymentSettings();
  }

  // ── Viewport Controls ─────────────────────────────────────────────────────
  function setViewport(mode) {
    studioState.activeViewport = mode;
    $$(".vp-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.vp === mode));

    const container = $("#preview-frame-container");
    if (!container) return;

    container.className = "preview-frame-container " + mode;
  }

  // ── Inspector Tabs ────────────────────────────────────────────────────────
  function setInspectorTab(tabId) {
    $$(".insp-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
    $$(".insp-content").forEach(c => c.style.display = c.id === tabId ? "block" : "none");
  }

  // ── Inventory Management ──────────────────────────────────────────────────
  function renderInventoryTable() {
    const tbody = $("#inventory-tbody");
    if (!tbody) return;

    tbody.innerHTML = studioState.products.map(p => {
      let badgeClass = "in";
      let badgeLabel = `${p.stock} in stock`;
      if (p.stock <= 0) {
        badgeClass = "out";
        badgeLabel = "Sold Out";
      } else if (p.stock <= p.lowStockThreshold) {
        badgeClass = "low";
        badgeLabel = `Low (${p.stock})`;
      }

      return `
        <tr data-id="${p.id}" class="${p.id === studioState.selectedProductId ? 'selected' : ''}">
          <td><img src="${p.image}" class="table-thumb" alt="${p.title}"></td>
          <td>
            <strong>${p.title}</strong><br>
            <span style="font-size: 11px; color: var(--adobe-gray-400);">${p.size}</span>
          </td>
          <td><code style="color: var(--gold-accent);">${p.sku}</code></td>
          <td>${p.category}</td>
          <td>
            <strong>$${p.price.toFixed(2)}</strong>
            ${p.comparePrice ? `<br><s style="color: var(--adobe-gray-400); font-size: 10px;">$${p.comparePrice.toFixed(2)}</s>` : ''}
          </td>
          <td>
            <span class="badge-stock ${badgeClass}">${badgeLabel}</span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 4px;">
              <button class="btn-tbl-action" onclick="window.WebStudio.selectProduct('${p.id}')">Edit</button>
              <button class="btn-tbl-action delete" onclick="window.WebStudio.deleteProduct('${p.id}')">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function selectProduct(productId) {
    studioState.selectedProductId = productId;
    const prod = studioState.products.find(p => p.id === productId);
    if (!prod) return;

    // Fill Product Inspector
    $("#insp-prod-id").value = prod.id;
    $("#insp-prod-title").value = prod.title;
    $("#insp-prod-sku").value = prod.sku;
    $("#insp-prod-category").value = prod.category;
    $("#insp-prod-size").value = prod.size;
    $("#insp-prod-price").value = prod.price;
    $("#insp-prod-compare").value = prod.comparePrice || "";
    $("#insp-prod-stock").value = prod.stock;
    $("#insp-prod-desc").value = prod.description;
    $("#insp-prod-ingredients").value = prod.ingredients;
    $("#insp-prod-usage").value = prod.usage;
    $("#insp-prod-img-preview").src = prod.image;

    setInspectorTab("insp-product-tab");
    renderInventoryTable();
  }

  function saveSelectedProductFromInspector() {
    const id = $("#insp-prod-id").value;
    const prod = studioState.products.find(p => p.id === id);
    if (!prod) return;

    prod.title = $("#insp-prod-title").value.trim();
    prod.sku = $("#insp-prod-sku").value.trim();
    prod.category = $("#insp-prod-category").value.trim();
    prod.size = $("#insp-prod-size").value.trim();
    prod.price = parseFloat($("#insp-prod-price").value) || prod.price;
    const compVal = $("#insp-prod-compare").value.trim();
    prod.comparePrice = compVal ? parseFloat(compVal) : null;
    prod.stock = parseInt($("#insp-prod-stock").value, 10) || 0;
    prod.description = $("#insp-prod-desc").value.trim();
    prod.ingredients = $("#insp-prod-ingredients").value.trim();
    prod.usage = $("#insp-prod-usage").value.trim();

    saveStudioState();
    renderInventoryTable();
  }

  function openNewProductModal() {
    const modal = $("#modal-new-product");
    if (modal) modal.classList.add("open");
  }

  function closeNewProductModal() {
    const modal = $("#modal-new-product");
    if (modal) modal.classList.remove("open");
  }

  function createNewProduct() {
    const title = $("#new-prod-title").value.trim();
    const sku = $("#new-prod-sku").value.trim() || `AC-RM-${Math.floor(100 + Math.random() * 900)}`;
    const category = $("#new-prod-category").value.trim() || "Tinctures";
    const size = $("#new-prod-size").value.trim() || "60 ml (2 fl oz)";
    const price = parseFloat($("#new-prod-price").value) || 24.00;
    const stock = parseInt($("#new-prod-stock").value, 10) || 25;
    const desc = $("#new-prod-desc").value.trim() || "Artisanal botanical formulation handcrafted with organic herbs and botanicals.";
    const ingredients = $("#new-prod-ingredients").value.trim() || "Organically grown whole plant extracts.";

    if (!title) {
      alert("Please specify a botanical preparation title.");
      return;
    }

    const newProd = {
      id: "prod-" + Date.now(),
      sku,
      title,
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]/g, ""),
      size,
      price,
      comparePrice: null,
      stock,
      lowStockThreshold: 5,
      image: "assets/elixir.svg",
      description: desc,
      ingredients,
      usage: "Dispense as needed according to daily botanical rituals.",
      badge: "New Release"
    };

    studioState.products.push(newProd);
    studioState.selectedProductId = newProd.id;
    saveStudioState();
    closeNewProductModal();
    renderInventoryTable();
    selectProduct(newProd.id);
  }

  function deleteProduct(productId) {
    if (!confirm("Are you sure you wish to delete this preparation from the catalog?")) return;
    studioState.products = studioState.products.filter(p => p.id !== productId);
    if (studioState.selectedProductId === productId) {
      studioState.selectedProductId = studioState.products[0]?.id || null;
    }
    saveStudioState();
    renderInventoryTable();
  }

  // ── Payments & Direct Selling ─────────────────────────────────────────────
  function renderPaymentSettings() {
    if (!studioState.config) return;
    const c = studioState.config;
    if ($("#cfg-store-name")) $("#cfg-store-name").value = c.storeName || "";
    if ($("#cfg-tagline")) $("#cfg-tagline").value = c.tagline || "";
    if ($("#cfg-address")) $("#cfg-address").value = c.address || "";
    if ($("#cfg-city-state-zip")) $("#cfg-city-state-zip").value = c.cityStateZip || "";
    if ($("#cfg-phone")) $("#cfg-phone").value = c.phone || "";
    if ($("#cfg-email")) $("#cfg-email").value = c.email || "";
    if ($("#cfg-tax-rate")) $("#cfg-tax-rate").value = (c.taxRate * 100).toFixed(1);
    if ($("#cfg-freeship")) $("#cfg-freeship").value = c.freeShippingThreshold || 65;
  }

  function savePaymentSettings() {
    studioState.config.storeName = $("#cfg-store-name").value.trim();
    studioState.config.tagline = $("#cfg-tagline").value.trim();
    studioState.config.address = $("#cfg-address").value.trim();
    studioState.config.cityStateZip = $("#cfg-city-state-zip").value.trim();
    studioState.config.phone = $("#cfg-phone").value.trim();
    studioState.config.email = $("#cfg-email").value.trim();
    studioState.config.taxRate = (parseFloat($("#cfg-tax-rate").value) || 7.0) / 100.0;
    studioState.config.freeShippingThreshold = parseFloat($("#cfg-freeship").value) || 65.0;

    saveStudioState();
    alert("Storefront payment and botanical config saved successfully!");
  }

  // ── Invoices & Receipts Management ────────────────────────────────────────
  function renderInvoicesTable() {
    const tbody = $("#invoices-tbody");
    if (!tbody) return;

    if (!studioState.orders || studioState.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--adobe-gray-400); padding: 40px;">No customer orders placed yet. Test checkout in the Designer preview to generate an invoice.</td></tr>`;
      return;
    }

    tbody.innerHTML = studioState.orders.map(o => `
      <tr>
        <td><strong style="color: var(--gold-accent); font-family: var(--ui-mono);">${o.orderNumber}</strong></td>
        <td>${o.date}</td>
        <td>
          <strong>${o.customer.name}</strong><br>
          <span style="font-size: 11px; color: var(--adobe-gray-400);">${o.customer.email}</span>
        </td>
        <td><span class="badge-stock in">${o.payment.status}</span></td>
        <td style="font-family: var(--ui-mono); font-weight: 700;">$${o.pricing.grandTotal.toFixed(2)}</td>
        <td style="text-align: right;">
          <button class="btn-tbl-action" onclick="window.WebStudio.previewOrderInvoice('${o.orderNumber}')">View &amp; Print</button>
        </td>
      </tr>
    `).join("");
  }

  function previewOrderInvoice(orderNumber) {
    const order = studioState.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;

    const iframe = $("#preview-iframe");
    if (iframe && iframe.contentWindow && iframe.contentWindow.ApothecaryStore) {
      setWorkspace("designer");
      iframe.contentWindow.ApothecaryStore.showInvoiceModal(order);
    } else {
      alert(`Invoice ${orderNumber} for ${order.customer.name} totaling $${order.pricing.grandTotal.toFixed(2)}`);
    }
  }

  // ── Compositor Asset Bridge ───────────────────────────────────────────────
  function initCompositorDropzone() {
    const dropzone = $("#compositor-dropzone");
    const fileInput = $("#compositor-file-input");

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImportedImage(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImportedImage(e.target.files[0]);
      }
    });
  }

  function handleImportedImage(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const currentProd = studioState.products.find(p => p.id === studioState.selectedProductId);
      if (currentProd) {
        currentProd.image = dataUrl;
        saveStudioState();
        selectProduct(currentProd.id);
        alert(`Artwork successfully assigned to ${currentProd.title}!`);
      } else {
        alert("Artwork imported into Compositor scratchpad.");
      }
    };
    reader.readAsDataURL(file);
  }

  // ── Production Site Exporter ──────────────────────────────────────────────
  function exportProductionWebsite() {
    // Generate package summary
    const prodsJson = JSON.stringify(studioState.products, null, 2);
    const configJson = JSON.stringify(studioState.config, null, 2);

    const alertMsg = `
✨ Ready to Publish The Apothecary's Cabinet!
All template assets, botanical SVGs, responsive layout, Stripe/PayPal checkout engine, and invoice generator are prepared in:

📁 /mnt/nvme0/AIRLOCK/WebStudio/templates/apothecary/

To deploy to Netlify, Vercel, or GitHub Pages:
Simply copy this folder to your hosting provider or run:
$ cd /mnt/nvme0/AIRLOCK/WebStudio/templates/apothecary && python3 -m http.server 8080
    `;
    alert(alertMsg);
  }

  // ── Status Bar ────────────────────────────────────────────────────────────
  function updateStatusBar() {
    const totalStock = studioState.products.reduce((sum, p) => sum + p.stock, 0);
    const countEl = $("#status-prod-count");
    const stockEl = $("#status-stock-count");
    const ordersEl = $("#status-orders-count");

    if (countEl) countEl.textContent = `${studioState.products.length} Preparations`;
    if (stockEl) stockEl.textContent = `${totalStock} Units in Stock`;
    if (ordersEl) ordersEl.textContent = `${studioState.orders.length} Invoices`;
  }

  function refreshAllPanels() {
    renderInventoryTable();
    renderPaymentSettings();
    renderInvoicesTable();
    updateStatusBar();
  }

  // ── Event Bindings ────────────────────────────────────────────────────────
  function initEvents() {
    // Workspace Tabs
    $$(".ws-tab").forEach(tab => {
      tab.addEventListener("click", () => setWorkspace(tab.dataset.ws));
    });

    $$(".tool-btn[data-ws]").forEach(btn => {
      btn.addEventListener("click", () => setWorkspace(btn.dataset.ws));
    });

    // Viewport switchers
    $$(".vp-btn").forEach(btn => {
      btn.addEventListener("click", () => setViewport(btn.dataset.vp));
    });

    // Inspector Tabs
    $$(".insp-tab").forEach(tab => {
      tab.addEventListener("click", () => setInspectorTab(tab.dataset.tab));
    });

    // Inspector form live listeners
    const inspInputs = [
      "insp-prod-title", "insp-prod-sku", "insp-prod-category", "insp-prod-size",
      "insp-prod-price", "insp-prod-compare", "insp-prod-stock", "insp-prod-desc",
      "insp-prod-ingredients", "insp-prod-usage"
    ];
    inspInputs.forEach(id => {
      const el = $(`#${id}`);
      if (el) el.addEventListener("input", () => saveSelectedProductFromInspector());
    });

    // Menu dropdown toggles
    $$(".menu-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const item = btn.closest(".menu-item");
        const isOpen = item.classList.contains("active");
        $$(".menu-item").forEach(i => i.classList.remove("active"));
        if (!isOpen) item.classList.add("active");
        e.stopPropagation();
      });
    });

    document.addEventListener("click", () => {
      $$(".menu-item").forEach(i => i.classList.remove("active"));
    });

    // Dropzone
    initCompositorDropzone();

    // Cross-window messages from iframe
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "APOTHECARY_SYNC_UPDATE") {
        if (e.data.payload.products) {
          studioState.products = e.data.payload.products;
        }
        if (e.data.payload.config) {
          studioState.config = e.data.payload.config;
        }
        updateStatusBar();
      }
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.WebStudio = {
    setWorkspace,
    setViewport,
    selectProduct,
    openNewProductModal,
    closeNewProductModal,
    createNewProduct,
    deleteProduct,
    savePaymentSettings,
    previewOrderInvoice,
    exportProductionWebsite,
    getState: () => studioState
  };

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    loadInitialState();
  });
})();
