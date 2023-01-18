const fs = require ("fs");


class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    fileExist(){
        return fs.existsSync(this.path)
    }

    addProduct(product) {
        return new Promise((resolve, reject) => {
            if(this.fileExist()){
                console.log("el archivo existe");
                fs.readFile(this.path,(err, data) =>{
                    if(err){
                        console.log("no se pudo leer el archivo")
                    }
                    this.products = JSON.parse(data);
                    for (const key in product){
                        if(product[key]===""|| !product[key]){
                            console.log("falta ingresar un campo al producto");
                            return
                        }
                    }
                    const codif = this.products.find((p) => p.code === product.code)
                    if (codif === undefined) {
                        console.log("el producto no existe")
                        const lastId = this.products.reduce((max, prod) => (prod.id > max ? prod.id:max),0)
                        this.products.push({
                            id:lastId+1,...product
                        })
                    }else{
                        console.log(`Su producto ${product.title}, tiene un codigo ${product.code} que ya existe`)
                        return
                    }
                    fs.writeFile(this.path, JSON.stringify(this.products),(error)=>{
                        if(error){
                            console.log("Error al escribir el archivo");
                        }
                        resolve()
                    }) 
                })
            } else{
                fs.writeFile(this.path, JSON.stringify([{
                    id: this.products.length+1,...product
                }]),(error)=>{
                    if(error){
                        console.log("Error al escribir el archivo")
                    } 
                    resolve()
                })
            }
        })
    }
    getProducts() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, "utf-8",(error, data)=>{
                if(error){
                    reject(error)
                }
                this.product = JSON.parse(data)
                resolve(this.product)
            })
        });
    }

    getProductById(id) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, "utf-8",(error, data)=>{
                if(error){
                    reject(error)
                }
                this.products = JSON.parse(data)
                const findId = this.products.find((p) => p.id === id)
                if (findId) {
                    resolve(findId);
                } else {
                    console.log("NOT FOUND");
                }
            })
        }) 
    }
    updateProduct({...props}){
        return new Promise((resolve, reject) =>{
            fs.readFile(this.path, "utf-8",(error, data)=>{
                if(error){
                    reject(error)
                }
                this.products = JSON.parse(data)
                const productId = this.products.find((p) => p.id === props.id)
                this.products = this.products.map(p => p.id === props.id?{...p,...props}:p)
                fs.writeFile(this.path,JSON.stringify(this.products,(error)=>{
                    if(error){
                        console.log("Error al escribir el archivo")
                    }
                    resolve({...productId,...props})
                }))
        })
    
    })

}

deleteProdById(id){
    return new Promise((resolve, reject) => {
        fs.readFile(this.path, "utf-8",(error, data)=>{
            if(error){
                reject(error)
            }
            this.products = JSON.parse(data)
            this.products = this.products.filter((p) => p.id !== id)
            fs.writeFile(this.path,JSON.stringify(this.products,(error)=>{
                if(error){
                    console.log("Error al escribir el archivo")
                }
                resolve()
        }))

    })
})
}


}















const product1 = {
    title: "mate",
    description: "elemento unico",
    price: 1000,
    thumbnail: "sin img",
    code: "m1",
    stock: 100
}

const product2 = {
    title: "termo",
    description: "elemento doble",
    price: 1000,
    thumbnail: "sin img",
    code: "m2",
    stock: 100
}

const allProducts = new ProductManager("./stock.json")

const fileRun = async () =>{
    // Va a cargar los prod a la base de datos
    // await allProducts.addProduct(product2);
    // muestra los productos de la base de datos
    // console.log(await allProducts.getProducts())
    // Busca un producto por "id" y lo muestra
    const byId = await allProducts.getProductById(1)
    console.log("Producto by id", byId);
    const update = await allProducts.updateProduct({id:2,description:""})
}
fileRun();


    