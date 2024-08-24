console.log('Imported chunkbase.com.js v1.0.0!');

const seedRandomBtn = document.body.querySelector('#seed-random');

const mapControlsFlex = document.body.querySelector('#map-controls > div.map-controls-flex');
mapControlsFlex.parentNode.removeChild(mapControlsFlex);

const fancyBoxs = [2, 3]
    .map((e) => document.body.querySelector(`#map-controls-bar > div > .fancy-box:nth-child(${e})`))
    .forEach((node) => node.parentNode.removeChild(node));

const seed = document.body.querySelector('#seed');

const seedBox = document.body.querySelector(`#map-controls-bar > div > .fancy-box:nth-child(2)`);
seedBox.innerText = seed.value;

const seedmapLayers = document.body.querySelector('#seedmap-layers');
seedmapLayers.querySelectorAll('button').forEach((button) => {
    if (button.getAttribute('checked') == 'true' || button.getAttribute('aria-checked') == 'true')
        button.click();
});
const activeKeys = [
    'biomes',
    'spawn',
    'village',
    'pillagerOutpost',
    'ruinedPortalOverworld',
    'jungleTemple',
    'desertTemple',
    'buriedTreasure',
    'shipwreck',
    'lavaPool',
    'netherFortress',
    'bastionRemnant',
    'ruinedPortalNether',
    'endCity',
    'endGateway'
];
activeKeys.forEach((key) => seedmapLayers.querySelector(`button[data-poi="${key}"]`).click());

const biomeDimensionSelect = document.body.querySelector('#biome-dimension-select');

window.addEventListener('keydown', ({key}) => {
    switch (key.toLowerCase()) {
        case 'r':
            seedRandomBtn.click();
            seedBox.innerText = seed.value;
            break;
        case 'o':
            biomeDimensionSelect.value = 'overworld';
            biomeDimensionSelect.dispatchEvent(new Event('change'));
            break;
        case 'n':
            biomeDimensionSelect.value = 'nether';
            biomeDimensionSelect.dispatchEvent(new Event('change'));
            break;
        case 'e':
            biomeDimensionSelect.value = 'end';
            biomeDimensionSelect.dispatchEvent(new Event('change'));
            break;
    }
});
