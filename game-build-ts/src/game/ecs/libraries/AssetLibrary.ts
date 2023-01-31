// ussage:
//    import * as AssetLibrary from '../etc./etc.'

import yellowPacman from '../../assets/yellow-pacman.png';
import bluePacman from '../../assets/blue-pacman.png';
import redPacman from '../../assets/red-pacman.png';
import whitePacman from '../../assets/white-pacman.png';
import cliffArea from '../../assets/cliff-area.png';
import white1x1 from '../../assets/white-1x1.png';
// import redGhost from '../assets/red-ghost.png';
// import yellowGhost from '../assets/yellow-ghost.png';
// import pinkGhost from '../assets/pink-ghost.png';

const library = [
    {
        key: 'yellow-pacman',
        src: yellowPacman,
        type: 'IMAGE'
    },
    {
        key: 'blue-pacman',
        src: bluePacman,
        type: 'IMAGE'
    },
    {
        key: 'red-pacman',
        src: redPacman,
        type: 'IMAGE'
    },
    {
        key: 'white-pacman',
        src: whitePacman,
        type: 'IMAGE'
    },
    {
        key: 'bg-cliff-area',
        src: cliffArea,
        type: 'IMAGE'
    },
    {
        key: 'white-1x1',
        src: white1x1,
        type: 'IMAGE'
    },
    // {
    //     key: 'red-ghost',
    //     src: '../assets/red-ghost.png',
    //     type: 'IMAGE'
    // },
    // {
    //     key: 'yellow-ghost',
    //     src: '../assets/yellow-ghost.png',
    //     type: 'IMAGE'
    // },
    // {
    //     key: 'pink-ghost',
    //     src: '../assets/pink-ghost.png',
    //     type: 'IMAGE'
    // },
];

const getIndex = (key: string) => {
    for (let i = 0; i < library.length; i++) {
        if (library[i].key === key) return i;
    }
    return -1;
}

const getKey = (index: number) => {
    const key = library[index].key;
    if (!key) throw Error(`${index} is not a valid index into the asset library`);
    return key;
}

/**
 * Loads all native phaser global assets for re-use across all scenes
 * 
 * @param scene The phaser scene this function is called from
 */
const loadAll = (scene: Phaser.Scene) => {
    library.map(asset => {
        switch (asset.type) {
            case 'IMAGE': {
                scene.load.image(asset.key, asset.src);
                break;
            }
            default: {
                break;
            }
        }
    })
}

export { library, getIndex, getKey, loadAll }