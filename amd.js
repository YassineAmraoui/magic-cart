const extName = chrome.runtime.getManifest().name;

const isRedirectingToCheckoutPage = result => {
    const {data} = result.find(({command}) => command === "openDialog") || {};
    if (data) {
        window.location.href = /"(\/[a-z]{2}\/direct-buy\/checkout\/payment\/[^"]+)"/.exec(data)[1];
        return true;
    }
    return false;
}

const onClick = (button, productId) => {
    button.disabled = true;
    try {
        (async() => {
            const result = await fetch(`https://www.amd.com/en/direct-buy/add-to-cart/${productId}?_wrapper_format=drupal_ajax`, {
                "body": "js=true&_drupal_ajax=1",
                "method": "POST",
                "credentials": "include"
            }).then(e => e.json());
            const announce = result.find(({ command }) => command === "announce");
            if (announce && announce.text === "Product added to cart.") {
                if (!isRedirectingToCheckoutPage(result)) {
                    const res = await fetch("https://www.amd.com/en/direct-buy/shopping-cart/modal?_wrapper_format=drupal_modal", {
                        "body": "js=true&_drupal_ajax=1",
                        "method": "POST",
                        "credentials": "include"
                    }).then(a=>a.json());

                    isRedirectingToCheckoutPage(res);
                }
            }
        })();
    } finally {
        button.disabled = false;
    }
};

const checkButton = () => {
    (async() => {
        if (document.querySelector(".product-out-of-stock")) {
            const productId = document.location.pathname.split("/")[3];
            try {
                const result = await fetch(`https://www.amd.com/en/direct-buy/add-to-cart/${productId}?_wrapper_format=drupal_ajax`, {
                    "body": "js=true&_drupal_ajax=1",
                    "method": "POST",
                    "credentials": "omit"
                }).then(e => e.json());

                const announce = result.find(({ command }) => command === "announce");
                if (announce && announce.text === "Product added to cart.") {
                    const button = document.createElement("button");
                    button.className = "btn-shopping-cart btn-shopping-neutral use-ajax";
                    button.innerHTML = "Add to cart";
                    button.onclick = () => onClick(button, productId);

                    const fixedByDiv = document.createElement("div");
                    fixedByDiv.innerText = `FIXED by ${extName}`;
                    const div = document.createElement("div");
                    div.appendChild(button);
                    div.appendChild(fixedByDiv);
                    document.querySelector(".product-out-of-stock").replaceWith(div);
                }
            } catch (e) {

            }
        }
    })();
};

checkButton();
setInterval(checkButton, 5000);
