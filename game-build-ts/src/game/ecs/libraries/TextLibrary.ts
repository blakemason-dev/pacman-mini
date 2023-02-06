
const library = [
    {
        key: 'generate-pacman',
        text: 'Generate Pacman',
        style: {
            fontFamily: "arial",
            fontSize: "14px",
            color: "#0000ff"
        },
        type: 'TEXT'
    },
    {
        key: 'generate-ghost',
        text: 'Generate Ghost',
        style: {
            fontFamily: "arial",
            fontSize: "14px",
            color: "#0000ff"
        },
        type: 'TEXT'
    },
    {
        key: 'counter',
        text: 'Counter: 0',
        style: {
            fontFamily: "arial",
            fontSize: "20px",
            color: "#ffffff"
        },
        type: 'TEXT'
    },
    {
        key: 'red-score',
        text: '0',
        style: {
            fontFamily: "arial",
            fontSize: "20px",
            color: "#ff0000"
        },
        type: 'TEXT'
    },
    {
        key: 'blue-score',
        text: '0',
        style: {
            fontFamily: "arial",
            fontSize: "20px",
            color: "#0000ff"
        },
        type: 'TEXT'
    },
    {
        key: 'find-match',
        text: 'FIND MATCH',
        style: {
            fontFamily: "arial",
            fontSize: "20px",
            color: "#000000"
        },
        type: 'TEXT'
    },
    {
        key: 'find-new-match',
        text: 'FIND NEW MATCH',
        style: {
            fontFamily: "arial",
            fontSize: "20px",
            color: "#000000"
        },
        type: 'TEXT'
    },
];

const getIndex = (key: string) => {
    for (let i = 0; i < library.length; i++) {
        if (library[i].key === key) return i;
    }
    return -1;
}

const getKey = (index: number) => {
    const key = library[index].key;
    if (!key) throw Error(`${index} is not a valid index into the text library`);
    return key;
}

export { library, getIndex, getKey }