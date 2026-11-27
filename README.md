# funsies.fun

The fun hub of the elevat.ing family of websites. Everything here exists to have fun. Static site: `index.html`, `css/style.css`, `js/app.js`, `js/hmr-dock.js`. No build step, no external fonts or CDNs.

- Play: Fennsmash, Reaction App, and the tensegrity physics sim open full screen in the shared dock overlay, each with open in new tab.
- Wreck this page: buttons that run the dock's effects by name (`HMRDock.funsies(name)`). Burn and Dragons run this page's own real fire and small cute dragons (js/app.js).
- Design picker: `?design=1` to `?design=3`, with a four-level rating stored in localStorage.
- `js/hmr-dock.js` is a copy of the shared dock script.
- Deploy: any static host. `CNAME` is `funsies.fun`.
