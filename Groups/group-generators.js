let Generics = [

    {name: "Torus"},
    {name: "Cuboid"},
    {name: "Octahedron"},
    {name: "Icosahedron"},
    {name: "Prism"},
    {name: "Cube"},
    {name: "Dodecahedron"},
    {name: "Tetrahedron"},
    {name: "Sphere"},
    {name: "Pyramid"},
    {name: "Hyperboloid"},
    {name: "Balbis"},
    {name: "Möbius"},
    {name: "Lemniscate"},
    {name: "Hemihilex"}

];

module.exports.getIdentifier = _ => Generics[Math.floor(Math.random() * Generics.length)];

