import * as Yup from 'yup'

export const ProductSchema = Yup.object().shape({
    title: Yup.string().required(),
    count: Yup.number().required().positive().integer(),
    description: Yup.string(),
    price: Yup.number().required().positive(),
    published: Yup.string(),
    edition: Yup.number().positive().integer(),
    publisher: Yup.string(),
    authors: Yup.array().of(Yup.string()),
    cover_url: Yup.string(),
    rating: Yup.number().positive()
  })