const FS = require('fs')
const express = require('express')


/* ---- clase "Contenedor" del ejercicio pasado ----- */
class Contenedor {
    
    constructor (file) {
        this.file = file //lectura del archivo deteccion de los objetos en el mismo parse del json a formato de array de objetos
    }

    save(newObject){
        FS.promises.readFile(this.file, 'utf-8')
        .then(contenido => {
            let lista = JSON.parse(contenido)
            newObject = {...newObject, id: (lista[lista.length - 1].id + 1)}
            lista = [...lista, newObject] 
            console.log(lista)
            FS.promises.writeFile(this.file, JSON.stringify(lista))
            .then(() => {
                console.log('se agrego el contenido!')
            })
            .catch(error => {console.log(error + " no se pudo escribir el archivo.")})
        })
        .catch(error => {
            console.log('no se pudo encontrar el archivo.' + error)
            newObject = {...newObject, id: 1}
            console.log(newObject)
            FS.promises.writeFile(this.file, JSON.stringify([newObject]))
            .then(() => {
                console.log('el archivo fue creado y se agrego el contenido!')
            })
            .catch(error => {console.log(error + "No se pudo escribir :(")})
        })
    }
    getById(id){
        FS.promises.readFile(this.file, 'utf-8')
        .then(contenido => {
            let lista = JSON.parse(contenido)
            let selectedObj = lista.filter((producto) => {
                if (producto.id == id) {
                    return producto
                }
            })
            console.log(selectedObj)
        })
        .catch(error => {
            console.log('no se pudo encontrar el producto' + error)
        })
    }
    getAll(){
        FS.promises.readFile(this.file, 'utf-8')
        .then(contenido => {
        let lista = JSON.parse(contenido)
        console.log(lista)
        return lista
    })
        .catch(error => {console.log('no se pudo encontrar el archivo, o esta vacio' + error)})
    }
    deleteById(id){
        FS.promises.readFile(this.file, 'utf-8')
        .then(contenido => {
            let lista = JSON.parse(contenido)
            let listaFiltrada = lista.filter((producto) => {
                if (producto.id != id) {
                    return producto
                }
            })
            console.log(listaFiltrada)
            FS.promises.writeFile(this.file, JSON.stringify(listaFiltrada))
            .then(() => {
                console.log('se elimino el contenido!')
            })
            .catch(error => {console.log(error + "no se pudo eliminar :(")})
        })
        .catch(error => {
            console.log('no se pudo encontrar el producto' + error)
        })
    }
    deleteAll(){
        FS.promises.unlink(this.file, (error) => {console.log('no se pudo borrar' + error)})
    }
    getRandom(){
        FS.promises.readFile(this.file, 'utf-8')
        .then(contenido => {
        let lista = JSON.parse(contenido)
        return lista[Math.floor(Math.random() * lista.length)]
        })
    }
}
/* -------------------------------------------------------------------------------- */

let productos = new Contenedor('./productos.txt')

function getRandom(file) {
    let lista = JSON.parse(FS.readFileSync(file, 'utf-8'))
    return lista[Math.floor(Math.random() * lista.length)]
}
function getAll(file) {
    let lista = JSON.parse(FS.readFileSync(file, 'utf-8'))
    return lista
}



/* ------------Servidor --------------- */
const APP = express()

const PORT = 8080
const SERVER = APP.listen(PORT, ()=>{
    console.log(`servidor http escuchando en el puerto ${SERVER.address().port}`)
})
SERVER.on('error', (error) => {console.log(`error en servidor: ${error}`)})

APP.get('/', (req, res) => {
    res.send(/* {mensaje: 'Hola mundo Backend!'} */ `<h2> Hola Mundo Backend! </h2>`)
})

APP.get('/productos', (req, res) => {
    res.send(`<h3> esta es la lista de productos hasta el momento: ${JSON.stringify(getAll(productos.file))} </h3>`)
})
APP.get('/productoRandom', (req, res) => {
    res.send(`<h3> esta es la lista de productos hasta el momento: ${JSON.stringify(getRandom(productos.file))} </h3>`)
})
/* ------------ Servidor ------------- */




