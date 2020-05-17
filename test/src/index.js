import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 1300,
    height: 768,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});

document.body.appendChild(app.view);

const loader = new PIXI.Loader();
loader.add('font1', 'resources/texture_0.xml');
loader.add('font2', 'resources/texture_1.xml');
loader.add('font3', 'resources/texture_2.xml');

loader.load((loader, resources) => {

    const myFont1 = new PIXI.BitmapText("1234567890", {
        font: {
            name: 'sample1',
            size: 175
        }
    });

    myFont1.position.x = 50;
    myFont1.position.y = 50;

    const myFont2 = new PIXI.BitmapText("ABCDEFGH", {
        font: {
            name: 'sample2',
            size: 166
        }
    });

    myFont2.position.x = 50;
    myFont2.position.y = 280;

    const myFont3 = new PIXI.BitmapText("IJKLMNO", {
        font: {
            name: 'sample3',
            size: 211
        }
    });

    myFont3.position.x = 50;
    myFont3.position.y = 450;

    app.stage.addChild(myFont1);
    app.stage.addChild(myFont2);
    app.stage.addChild(myFont3);
});
