import { context, ContractPromiseBatch } from "near-sdk-core";
import { Product, listedProducts } from "./model";


// import { PersistentUnorderedMap } from "near-sdk-as";

// export const products = new PersistentUnorderedMap<string, string>("PRODUCTS");


export function setProduct(product: Product): void
{
    let storedProduct = listedProducts.get(product.id)
    if (storedProduct !== null)
    {
        throw new Error(`a product with ${product.id} already exist`)
    }
    listedProducts.set(product.id, Product.fromPayload(product))
}

export function getProduct(id: string): Product | null {
    return listedProducts.get(id);
}

export function getProducts(): Product[]
{
    return listedProducts.values();
}


//When you buy a product the amount sold , the qty sold and the likes increases.

export function buyProduct(productId: string): void
{
    const product = getProduct(productId)
    if (product === null)
    {
        throw new Error("Product not found")
    }
    if (product.price.toString() != context.attachedDeposit.toString())
    {
        throw new Error("Attached deposit should equal to the product's price");
    }
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
    product.incrementSoldAmount();
    product.incrementLikes();
    listedProducts.set(product.id, product);
}



