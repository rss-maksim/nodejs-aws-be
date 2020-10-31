import { products } from "./products"

interface IProduct {
    title: string
    count: number
    id: string
    description: string
    price: number
}

export const getProducts = async (): Promise<IProduct[]> => products

export const getProductById = async (uid: string): Promise<IProduct | null>  =>
    products.find(({ id }) => id === uid)
