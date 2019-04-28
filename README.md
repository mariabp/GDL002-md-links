# Markdown Links
## Descripción del módulo
MD-Links es una librería cuya principal función es leer y analizar archivos en formato `Markdown` (*.md), para verificar el estado de los enlaces o ligas que contiene y reportar cuantos encontró, cuantos enlaces están rotos y cuantos son únicos.
## Documentación
### Requerimientos previos
-  [node.js](https://nodejs.org/en/download/)
### Instalación
Este módulo se instala desde la terminal, en donde será necesario escribir el siguiente comando para iniciar la instalación: 
```sh

$ npm install mariabp-md-links

```
Al presionar enter, se instalará la librería y las dependencias necesarias para que esta funcione correctamente. 

## Funcionamiento

### JavaScript API

El módulo puede importarse en otros scripts de Node.js y debe ofrece la siguiente interfaz:

#### `mdLinks(path, options)`

##### Argumentos

- `path`: Ruta absoluta o relativa al archivo o directorio. Si la ruta pasada es relativa, se resuelve con respecto al directorio desde donde se invoca.

- `options`: Un objeto con las siguientes propiedades:

	- `--validate`: Booleano que determina si se desea validar los links encontrados.
	- `--stats`: Booleano que determina si se desea obtener  las siguientes estadísticas de los enlaces:
	
		- Total de enlaces encontrados.
		-	Total de enlaces únicos encontrados.
	- `--validate --stats`: Booleano que determina si se desea obtener  las siguientes estadísticas de los enlaces:
	
		-	Total de enlaces únicos encontrados.
		-	Total de enlaces rotos encontrados
		-	Total de enlaces encontrados.

##### Valor de retorno

La función retorna una promesa (`Promise`) que resuelva a un arreglo (`Array`) de objetos (`Object`), donde cada objeto representa un link y contiene las siguientes propiedades:
- `href`: URL encontrada.

- `text`: Texto que aparecía dentro del link (`<a>`).

- `file`: Ruta del archivo donde se encontró el link.

  
#### Ejemplo

```js

const mdLinks =  require("md-links");

  

// Caso 1 .- Ruta relativa sin options

mdLinks("./some/example.md")

.then(links  => {

// => [{ href, text, file }]

})

.catch(console.error);

  

// Caso .- Ruta relativa con option (validate)

mdLinks("./some/example.md", { validate: true })

.then(links  => {

// => [{ href, text, file, status, ok }]

})

.catch(console.error);

  

// Caso 3 .- Ruta relativa de un directorio sin options

mdLinks("./some/dir")

.then(links  => {

// => [{ href, text, file }]

})

.catch(console.error);

  

//PD: Pueden presentarse más casos.

```

  

### CLI (Command Line Interface - Interfaz de Línea de Comando)

El ejecutable de nuestra aplicación se ejecuta de la siguiente manera a través de la terminal:

`md-links <path-to-file> [options]`

Por ejemplo:
```sh

$ md-links ./some/example.md

./some/example.md http://algo.com/2/3/ Link a algo

./some/example.md https://otra-cosa.net/algun-doc.html algún doc

./some/example.md http://google.com/ Google

```

El comportamiento por defecto no valida si las URLs responden ok o no, solo debe identifica el archivo markdown (a partir de la ruta que recibe como
argumento), analiza el archivo Markdown e imprimé los links que vaya encontrando, junto con la ruta del archivo donde aparece y el texto que hay dentro del link.

  

#### Options

  

##### `--validate`

  

Si pasamos la opción `--validate`, el módulo hace una petición HTTP para averiguar si el link funciona o no. Si el link resulta en una redirección a una URL que responde ok, entonces consideramos el link como OK.

Por ejemplo:

```sh

$ md-links ./some/example.md --validate

./some/example.md http://algo.com/2/3/ ok 200 Link a algo

./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc

./some/example.md http://google.com/ ok 301 Google

```

Vemos que el _output_ en este caso incluye la palabra `ok` o `fail` después de la URL, así como el status de la respuesta recibida a la petición HTTP a dicha URL.

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas básicas sobre los links.
```sh

$ md-links ./some/example.md --stats

Total: 3

Unique: 3

```

También podemos combinar `--stats` y `--validate` para obtener estadísticas que necesiten de los resultados de la validación.

```sh

$ md-links ./some/example.md --stats --validate

Total: 3

Unique: 3

Broken: 1

```

## Diagrama de Flujo Markdown Links
![Diagrama de flujo md-links](images/md-links.png)
