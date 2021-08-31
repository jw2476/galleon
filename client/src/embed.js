export function loadEmbeds() {
    const links = document.getElementsByTagName("a")
    for (const link of links) {
        link.addEventListener("click", event => event.preventDefault())
    }
}
