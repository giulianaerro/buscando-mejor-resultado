
function deleteResults() {
    const button = document.querySelector(".header__search-button");
    const contentResultsEl = document.querySelector(".content-results");
    button.addEventListener("click", () => (contentResultsEl.innerHTML = ""));
}

function mostrarLosResultados(resultado) {
    console.log(resultado)
    const contenedor = document.querySelector(".content-results")
    const template = document.querySelector("#result-item-template")
    console.log(resultado)

    const titleEl = template.content.querySelector(".product__title")
    titleEl.textContent = resultado.title
    const priceEl = template.content.querySelector(".product__price")
    priceEl.textContent = "$" + resultado.price
    const installmentEl = template.content.querySelector(".product__item-sell-count")
    installmentEl.textContent = " " + resultado.sold_quantity
    const descriptionEl = template.content.querySelector(".product__description")
    descriptionEl.textContent = resultado.addDescription
    const imgEl = template.content.querySelector(".img")
    imgEl.src = resultado.thumbnail
    const linkEl = template.content.querySelector(".product__link-reference")
    linkEl.href = resultado.permalink

    const clone = document.importNode(template.content, true)
    contenedor.appendChild(clone)

}

function populateProductDesc(resultado) {
    const id = resultado.id;
    return fetch(
        `https://api.mercadolibre.com/items/${id}/description`
    ).then((res) => res.json()).then((data) => {
        resultado.addDescription = data.plain_text;

        mostrarLosResultados(resultado)
    })
}

function filtrarLosResultados(resultados) {
    const nose = resultados.filter((item) => {
        const productNew = item.condition == "new"
        const reputationSeller = item.seller.seller_reputation.transactions.ratings.positive > 0.96
        return productNew && reputationSeller
    })
    const sorted = nose.sort((a, b) => a.price - b.price)

    populateProductDesc(sorted[0])
}

async function main() {
    const formEl = document.querySelector(".header__search-form")
    formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        deleteResults();
        const buscarPalabra = e.target.buscar.value
        return fetch("https://api.mercadolibre.com/sites/MLA/search?q=" + buscarPalabra).then(response => response.json()).then(data => filtrarLosResultados(data.results));
    })

}
main()