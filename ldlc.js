const extName = chrome.runtime.getManifest().name;

const checkButton = () => {
    (async() => {
        const productPageStock = document.querySelector("#product-page-stock");
        if (productPageStock && productPageStock.getAttribute("data-stockcode") === "9") {
            const productId = document.querySelector(".main").getAttribute("data-product-id");
            const {status} = await fetch(`https://www.ldlc.com/v4/fr-fr/cart/add/offer/${productId}/1/0`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6",
                    "x-requested-with": "XMLHttpRequest"
                },
                "method": "GET",
                "credentials": "omit"
            });

            if (status === "OK") {
                document.querySelector("#product-page-stock").remove();
                const productPagePrice = document.querySelector("#product-page-price");
                const classNames = productPagePrice.className.split("").filter(Boolean).filter( c => c !== "hide");
                productPagePrice.className = classNames.join(" ");

                const div = document.createElement("div");
                div.innerText = `FIXED by ${extName}`;
                div.style = "text-align: center;"
                document.querySelector("#product-page-price").appendChild(div)
            }
        }
    })();
};

checkButton();
setInterval(checkButton, 5000);
