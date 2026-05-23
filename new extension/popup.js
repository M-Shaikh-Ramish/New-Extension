document.getElementById('translateBtn').addEventListener('click', async () => {
    const lang = document.getElementById('languageSelect').value;

    // Get active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if we can translate this page
    if (!tab || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("brave://") || tab.url.startsWith("about:")) {
        alert("This internal browser page cannot be translated.");
        return;
    }

    // If the page is already a Google Translate page, we update the language
    if (tab.url.includes("translate.google.com/translate")) {
        const urlObj = new URL(tab.url);
        urlObj.searchParams.set("tl", lang);
        chrome.tabs.update(tab.id, { url: urlObj.toString() });
    } else {
        // Redirect to Google Translate Web
        const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(tab.url)}`;
        chrome.tabs.update(tab.id, { url: translatedUrl });
    }
});
