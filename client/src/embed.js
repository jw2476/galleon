export function reloadEmbeds() {
    function e() {
        const e = {scale: .85, delay: 150, anchorOnly: !0};
        window.nwdbConfig && (window.nwdbConfig.hasOwnProperty("scale") && (e.scale = window.nwdbConfig.scale), window.nwdbConfig.hasOwnProperty("delay") && (e.delay = window.nwdbConfig.delay), window.nwdbConfig.hasOwnProperty("anchorOnly") && (e.anchorOnly = window.nwdbConfig.anchorOnly));
        const n = "https://nwdb.info", t = document.createElement("iframe");
        t.sandbox = "allow-scripts allow-popups allow-same-origin", t.style.opacity = 0, t.style.position = "fixed", t.style.height = "500px", t.style.width = "416px", t.style.zIndex = 9e4, t.style.pointerEvents = "none", t.style.transform = "scale(" + e.scale + ")", t.style.transformOrigin = "top left", t.style.marginLeft = "15px", t.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.75)", t.style.webkitBoxShadow = "0px 0px 0px 1px rgba(0,0,0,0.75)", t.style.border = "none", document.body.appendChild(t);
        let o, i, d, s, a, r = !1;

        function l(e) {
            e ? async function (e) {
                t.src = e + "?embed=true", r = !0, setTimeout(p, 0)
            }(new URL(e)) : w()
        }

        window.addEventListener("message", function (e) {
            let n = e.data;
            n && "nwdb-embed-resize" === n.type && (t.style.height = n.height + 0 + "px", r && (p(), t.style.opacity = 1))
        }, !1);
        const c = "ontouchstart" in document.documentElement && /mobi/i.test(navigator.userAgent);

        function w() {
            r = !1, t.style.opacity = 0
        }

        function p() {
            if (!t) return;
            s = i, a = d;
            const n = t.offsetHeight * e.scale, o = t.offsetWidth * e.scale + 15;
            a + n > window.innerHeight && (a = window.innerHeight - n), s + o > window.innerWidth && (s = window.innerWidth - o), t.style.top = a + "px", t.style.left = s + "px"
        }

        window.addEventListener("mousemove", function (t) {
            if (c) return;
            i = t.clientX, d = t.clientY;
            const s = function (e) {
                for (; e && "A" !== e.nodeName.toUpperCase() && "AREA" !== e.nodeName.toUpperCase();) e = e.parentNode;
                if (e) {
                    const t = e.href;
                    if (t && (t.includes(n + "/db/item/") || t.includes(n + "/db/perk/") || t.includes(n + "/db/ability/") || t.includes(n + "/db/quest/") || t.includes(n + "/db/recipe/") || t.includes(n + "/db/gatherable/") || t.includes(n + "/db/creature/"))) {
                        e.addEventListener("click", event => event.preventDefault())
                        return t
                    }
                }
                return !1
            }(t.target);
            s ? (clearTimeout(o), o = setTimeout(() => {
                r || l(s)
            }, e.delay), p()) : (clearTimeout(o), w())
        })
    }

    "interactive" === document.readyState ? e() : document.addEventListener("DOMContentLoaded", function (n) {
        e()
    })
}
