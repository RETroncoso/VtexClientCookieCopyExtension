document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyCookiesButton");
	const vendorInput = document.getElementById("vendorInput");

  const copyCookiesToLocalStorage = async () => {
    const saveText = copyButton.textContent;

    copyButton.classList.remove("copyButton");
    copyButton.classList.add("loading");
    copyButton.textContent = "";

		if (!vendorInput.value) {
			copyButton.classList.remove("loading");
			copyButton.classList.add("error");
			copyButton.textContent = "Ingrese un vendor";
			removeClass("error", saveText, copyButton)
			return;
		}

		const vendor = vendorInput.value;

    const {
			cookieName,
			cookieValue,
			redirectUrl,
		} = await getCookie(vendor, "VtexIdclientAutCookie");
		console.log(cookieName, cookieValue, redirectUrl);

    if (!cookieValue) {
      copyButton.classList.remove("loading");
      copyButton.classList.add("error");
      copyButton.textContent = "Cookie no encontrada";

      removeClass("error", saveText, copyButton)

      return;
    }

    if (cookieValue) {
      copyButton.classList.remove("loading");
      copyButton.classList.add("ok");
      copyButton.textContent = "¡Cookie copiada!";
			
				chrome.cookies.set({
					url: redirectUrl,
					name: cookieName,
					value: cookieValue
			});			

			setTimeout(() =>{
				chrome.tabs.reload()
				window.close();
				}, 2000);

      removeClass("ok", saveText, copyButton)
    }
  };

  if (copyButton)
    copyButton.addEventListener("click", copyCookiesToLocalStorage);
});

const getCookie = async (vendor, name) => {
  const cookie = await chrome.cookies.get({ name, url: `https://${vendor}.myvtex.com` });
  return {
    cookieName: cookie?.name || '',
    cookieValue: cookie?.value || '',
    redirectUrl: `http://${vendor}.vtexlocal.com.br`,
  };
};

const removeClass = (className, textContent, buttonRef) => {
  setTimeout(() => {
    buttonRef.classList.remove(className);
    buttonRef.classList.add("copyButton");
    buttonRef.textContent = textContent;
  }, 5000);
}