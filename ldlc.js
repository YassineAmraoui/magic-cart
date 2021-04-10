const extName = chrome.runtime.getManifest().name;

// const noStock = `
// <div style="
// display: flex;
// flex-direction: column;
// text-align: center;
// padding: 10px;
// color: #000;
// background-color: palevioletred;
// ">
//     <div style="font-weight: bold;">Magic Cart</div>
//     <div>Le produit est réellement indisponible</div>
// </div>
// `

const success = `
<div style="
    text-align: center;
    background-color: lightgreen;
">Bouton affichés par <span style="font-weight: bold;">Magic Cart</span>
</div>
`;


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
            }).then(e => e.json());

            if (status === "OK") {
                document.querySelector("#product-page-stock").remove();
                const productPagePrice = document.querySelector("#product-page-price");
                const classNames = productPagePrice.className.split("").filter(Boolean).filter( c => c !== "hide");
                productPagePrice.className = classNames.join(" ");

                const successDiv = document.createElement("div");
                document.querySelector("#product-page-price").after(successDiv);
                successDiv.outerHTML = success;
            }
        }
    })();
};

checkButton();
